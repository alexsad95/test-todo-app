import { NextResponse } from 'next/server';
import db from '@/lib/models';
import { TEXTS } from '@/lib/texts';

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export async function GET() {
  try {
    const tasks = await db.Task.findAll({
      include: [{ model: db.Category, as: 'category' }],
      order: [['priority', 'ASC'], ['id', 'ASC']],
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_FETCHING_TASKS, error);
    return NextResponse.json(
      { error: TEXTS.ERRORS.FAILED_TO_FETCH_TASKS }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check if this is a restore action
    if (body.action === TEXTS.ACTIONS.RESTORE && body.deletedTask) {
      const restoredTask = await db.Task.create({
        title: body.deletedTask.title,
        completed: body.deletedTask.completed,
        priority: body.deletedTask.originalPriority || 0,
        categoryId: body.deletedTask.categoryId,
      });

      // Fetch the restored task with category information
      const createdTask = await db.Task.findByPk(restoredTask.id, {
        include: [{ model: db.Category, as: 'category' }],
      });

      return NextResponse.json(createdTask, { status: HTTP_STATUS.CREATED });
    }

    // Original POST logic for creating new tasks
    // Get the highest priority value and add 1 for the new task
    const maxPriorityTask = await db.Task.findOne({
      order: [['priority', 'DESC']],
      attributes: ['priority']
    });
    
    const newPriority = (maxPriorityTask?.priority ?? -1) + 1;
    
    const created = await db.Task.create({
      title: body.title,
      completed: Boolean(body.completed) || false,
      priority: newPriority,
      categoryId: body.categoryId ?? null,
    });
    
    // Fetch the created task with category information
    const createdTask = await db.Task.findByPk(created.id, {
      include: [{ model: db.Category, as: 'category' }],
    });
    
    return NextResponse.json(createdTask, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_CREATING_RESTORING_TASK, error);
    return NextResponse.json(
      { error: TEXTS.API_ERRORS.FAILED_TO_CREATE }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Check if this is an undo action for priorities
    if (body.action === TEXTS.ACTIONS.UNDO_PRIORITIES && body.previousOrder) {
      const transaction = await db.sequelize.transaction();
      
      try {
        // Restore previous priorities
        for (const item of body.previousOrder) {
          await db.Task.update(
            { priority: item.previousPriority },
            { 
              where: { id: item.id },
              transaction 
            }
          );
        }

        await transaction.commit();

        // Return updated tasks with restored priorities
        const updatedTasks = await db.Task.findAll({
          include: [{ model: db.Category, as: 'category' }],
          order: [['priority', 'ASC'], ['id', 'ASC']],
        });

        return NextResponse.json(updatedTasks);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    // Original PUT logic for updating tasks
    if (!body.id) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.ID_REQUIRED }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const task = await db.Task.findByPk(body.id);
    if (!task) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.NOT_FOUND }, 
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Update task fields
    if (typeof body.completed === 'boolean') task.completed = body.completed;
    if (typeof body.title === 'string') task.title = body.title;
    if (typeof body.categoryId !== 'undefined') task.categoryId = body.categoryId;
    if (typeof body.priority !== 'undefined') task.priority = body.priority;
    
    await task.save();

    // Fetch the updated task with category information
    const updatedTask = await db.Task.findByPk(body.id, {
      include: [{ model: db.Category, as: 'category' }],
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_UPDATING_TASK, error);
    return NextResponse.json(
      { error: TEXTS.API_ERRORS.FAILED_TO_UPDATE_PRIORITIES }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.ID_REQUIRED }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Get the task before deletion for potential undo
    const taskToDelete = await db.Task.findByPk(id, {
      include: [{ model: db.Category, as: 'category' }],
    });
    
    if (!taskToDelete) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.NOT_FOUND }, 
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Store the task data for undo functionality
    const deletedTask = {
      ...taskToDelete.toJSON(),
      deletedAt: new Date().toISOString(),
      originalPriority: taskToDelete.priority
    };

    const deleted = await db.Task.destroy({ where: { id } });
    if (!deleted) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.FAILED_TO_DELETE }, 
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      deletedTask: deletedTask 
    });
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_DELETING_TASK, error);
    return NextResponse.json(
      { error: TEXTS.ERRORS.FAILED_TO_DELETE_TASK }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    
    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: TEXTS.API_ERRORS.TASKS_ARRAY_REQUIRED }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Use a transaction to ensure data consistency
    const transaction = await db.sequelize.transaction();
    
    try {
      // Store previous order for potential undo
      const previousOrder = body.tasks.map((task, index) => ({
        id: task.id,
        previousPriority: task.previousPriority || index
      }));

      // Update priorities for all tasks in the new order
      for (let i = 0; i < body.tasks.length; i++) {
        const task = body.tasks[i];
        await db.Task.update(
          { priority: i },
          { 
            where: { id: task.id },
            transaction 
          }
        );
      }

      // Commit the transaction
      await transaction.commit();

      // Return updated tasks with new priorities and previous order for undo
      const updatedTasks = await db.Task.findAll({
        include: [{ model: db.Category, as: 'category' }],
        order: [['priority', 'ASC'], ['id', 'ASC']],
      });

      return NextResponse.json({
        tasks: updatedTasks,
        previousOrder: previousOrder
      });
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error(TEXTS.CONSOLE_ERRORS.ERROR_UPDATING_PRIORITIES, error);
    return NextResponse.json(
      { error: TEXTS.API_ERRORS.FAILED_TO_UPDATE_PRIORITIES }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}


