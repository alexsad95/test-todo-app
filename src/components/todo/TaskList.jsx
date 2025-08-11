"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Trash2, GripVertical, Undo } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskListSkeleton from "./TaskListSkeleton";
import { TEXTS } from "@/lib/texts";

const API_ENDPOINTS = {
  TASKS: "/api/tasks",
  CATEGORIES: "/api/categories",
};

const UNDO_HISTORY_LIMIT = 5;

// Draggable task item component
function DraggableTaskItem({ 
  task, 
  draggedTaskId, 
  dragOverTaskId, 
  updatingPriorities,
  canDrag,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onToggleCompleted,
  onRemove
}) {
  if (updatingPriorities && draggedTaskId === task.id) {
    return (
      <li className="task-item flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded transition-colors">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          </div>
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggleCompleted(task)}
          />
          <div className="flex-1">
            <p className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </p>
            {task.category?.name && (
              <p className="text-xs text-muted-foreground">{task.category.name}</p>
            )}
          </div>
        </div>
        <div 
          className="p-2 rounded transition-colors cursor-pointer hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRemove(task.id)}
          title="Delete task"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </li>
    );
  }

  return (
    <li 
      className={`task-item flex items-center justify-between px-6 py-3 ${
        draggedTaskId === task.id 
          ? 'dragging' 
          : dragOverTaskId === task.id 
          ? 'drag-over' 
          : ''
      }`}
      data-task-id={task.id}
      draggable={canDrag}
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragOver={(event) => onDragOver(event, task.id)}
      onDragLeave={(event) => onDragLeave(event, task.id)}
      onDrop={(event) => onDrop(event, task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3">
        <div 
          className="p-1 rounded transition-colors cursor-grab"
          title={TEXTS.TASK_LIST.DRAG_TO_REORDER_TOOLTIP}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => onToggleCompleted(task)}
        />
        <div className="flex-1">
          <p className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.title}
          </p>
          {task.category?.name && (
            <p className="text-xs text-muted-foreground">{task.category.name}</p>
          )}
        </div>
      </div>
      <div 
        className="p-2 rounded transition-colors cursor-pointer hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onRemove(task.id)}
        title="Delete task"
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
      </div>
    </li>
  );
}

export default function TaskList({ refreshKey = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [updatingPriorities, setUpdatingPriorities] = useState(false);
  const [undoingAction, setUndoingAction] = useState(false);
  const [undoHistory, setUndoHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState(TEXTS.FILTERS.DEFAULT);

  // Get the last action for undo
  const lastAction = undoHistory[0];

  // Helper function to reset all task item transforms
  const resetAllTransforms = () => {
    setTimeout(() => {
      const allTaskItems = document.querySelectorAll('.task-item');
      allTaskItems.forEach(item => {
        item.style.transform = 'none';
        item.classList.remove('dragging', 'drag-over', 'reordering');
      });
    }, 100);
  };

  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TASKS, { cache: TEXTS.CACHE.NO_STORE });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.LOAD_TASKS_FAILED);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError(TEXTS.ERRORS.LOAD_TASKS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES, { cache: TEXTS.CACHE.NO_STORE });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.LOAD_CATEGORIES_FAILED);
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      // Ignore: form will show message when creating
    }
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [refreshKey]);

  // Reset all transforms when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      resetAllTransforms();
    }
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filterCategoryId === TEXTS.FILTERS.DEFAULT) return tasks;
    const categoryId = Number(filterCategoryId);
    return tasks.filter(task => task.categoryId === categoryId);
  }, [tasks, filterCategoryId]);

  // Reset transforms when filter changes
  useEffect(() => {
    resetAllTransforms();
  }, [filterCategoryId]);

  // Sort tasks by priority to ensure correct order
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => a.priority - b.priority);
  }, [filteredTasks]);

  const toggleCompleted = async (task) => {
    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: TEXTS.HTTP_METHODS.PUT,
        headers: { "Content-Type": TEXTS.CONTENT_TYPES.JSON },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed
        }),
      });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.FAILED_TO_UPDATE_TASK);
      }
      
      await loadTasks();
      resetAllTransforms();
    } catch (error) {
      console.error(TEXTS.CONSOLE_ERRORS.FAILED_TO_UPDATE_TASK, error);
    }
  };

  const remove = async (taskId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TASKS}?id=${taskId}`, {
        method: TEXTS.HTTP_METHODS.DELETE
      });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.FAILED_TO_DELETE_TASK);
      }
      
      const result = await response.json();
      
      // Add to undo history
      if (result.deletedTask) {
        addToUndoHistory({
          type: 'delete',
          taskId,
          deletedTask: result.deletedTask
        });
      }
      
      await loadTasks();
      resetAllTransforms();
    } catch (error) {
      console.error(TEXTS.CONSOLE_ERRORS.FAILED_TO_DELETE_TASK, error);
    }
  };

  const addToUndoHistory = (action) => {
    setUndoHistory(prev => [action, ...prev.slice(0, UNDO_HISTORY_LIMIT - 1)]);
  };

  const restoreDeletedTask = async (deletedTask) => {
    try {
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: TEXTS.HTTP_METHODS.POST,
        headers: { "Content-Type": TEXTS.CONTENT_TYPES.JSON },
        body: JSON.stringify({
          action: TEXTS.ACTIONS.RESTORE,
          deletedTask
        }),
      });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.FAILED_TO_RESTORE_TASK);
      }
      
      await loadTasks();
      
      // Remove from undo history
      setUndoHistory(prev => prev.filter(action => 
        !(action.type === 'delete' && action.deletedTask.id === deletedTask.id)
      ));
    } catch (error) {
      console.error(TEXTS.CONSOLE_ERRORS.FAILED_TO_RESTORE_TASK, error);
    }
  };

  const updateTaskPriorities = async (newOrder) => {
    try {
      setUpdatingPriorities(true);
      
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: TEXTS.HTTP_METHODS.PATCH,
        headers: { "Content-Type": TEXTS.CONTENT_TYPES.JSON },
        body: JSON.stringify({
          tasks: newOrder.map((task, index) => ({
            ...task,
            previousPriority: task.priority
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.FAILED_TO_UPDATE_PRIORITIES);
      }
      
      const result = await response.json();
      
      // Add to undo history
      if (result.previousOrder) {
        addToUndoHistory({
          type: 'reorder',
          previousOrder: result.previousOrder
        });
      }
      
      setTasks(result.tasks);
      resetAllTransforms();
    } catch (error) {
      console.error(TEXTS.CONSOLE_ERRORS.FAILED_TO_UPDATE_PRIORITIES, error);
    } finally {
      setUpdatingPriorities(false);
    }
  };

  const undoLastAction = async () => {
    if (!lastAction) return;
    
    try {
      setUndoingAction(true);
      
      if (lastAction.type === 'delete') {
        await restoreDeletedTask(lastAction.deletedTask);
      } else if (lastAction.type === 'reorder') {
        const response = await fetch(API_ENDPOINTS.TASKS, {
          method: TEXTS.HTTP_METHODS.PUT,
          headers: { "Content-Type": TEXTS.CONTENT_TYPES.JSON },
          body: JSON.stringify({
            action: TEXTS.ACTIONS.UNDO_PRIORITIES,
            previousOrder: lastAction.previousOrder
          }),
        });
        
        if (!response.ok) {
          throw new Error(TEXTS.ERRORS.FAILED_TO_UNDO_PRIORITIES);
        }
        
        const updatedTasks = await response.json();
        setTasks(updatedTasks);
        
        // Remove from undo history
        setUndoHistory(prev => prev.slice(1));
        resetAllTransforms();
      }
    } catch (error) {
      console.error(TEXTS.CONSOLE_ERRORS.FAILED_TO_UNDO_PRIORITIES, error);
    } finally {
      setUndoingAction(false);
    }
  };

  const handleDragStart = (event, taskId) => {
    setDraggedTaskId(taskId);
    event.dataTransfer.effectAllowed = TEXTS.DRAG_DROP.EFFECT_ALLOWED;
    event.dataTransfer.setData(TEXTS.DRAG_DROP.DATA_FORMAT, taskId.toString());
  };

  const handleDragOver = (event, taskId) => {
    event.preventDefault();
    if (draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDragLeave = (event, taskId) => {
    if (dragOverTaskId === taskId) {
      setDragOverTaskId(null);
    }
  };

  const handleDrop = (event, dropTaskId) => {
    event.preventDefault();
    setDragOverTaskId(null);
    
    if (draggedTaskId === dropTaskId) return;
    
    const draggedTask = tasks.find(t => t.id === draggedTaskId);
    if (!draggedTask) return;
    
    const dropTask = tasks.find(t => t.id === dropTaskId);
    if (!dropTask) return;
    
    // Create new order
    const newOrder = [...tasks];
    const draggedIndex = newOrder.findIndex(t => t.id === draggedTaskId);
    const dropIndex = newOrder.findIndex(t => t.id === dropTaskId);
    
    // Remove dragged task from its current position
    newOrder.splice(draggedIndex, 1);
    
    // Insert at new position
    newOrder.splice(dropIndex, 0, draggedTask);
    
    // Update priorities
    updateTaskPriorities(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  if (loading) {
    return <TaskListSkeleton />;
  }

  if (error) return <p className="text-sm destructive">{error}</p>;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-muted-foreground">
              {TEXTS.TASK_LIST.CATEGORY_FILTER_LABEL}
            </label>
            <Select value={filterCategoryId} onValueChange={setFilterCategoryId}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={TEXTS.TASK_LIST.ALL_CATEGORIES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TEXTS.FILTERS.DEFAULT}>{TEXTS.TASK_LIST.ALL}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={loadTasks} size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{TEXTS.TASK_LIST.REFRESH_BUTTON_TOOLTIP}</p>
              </TooltipContent>
            </Tooltip>
            
            {lastAction && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={undoLastAction}
                    disabled={undoingAction}
                    size="sm"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{TEXTS.TASK_LIST.UNDO_BUTTON}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{TEXTS.TASK_LIST.TOTAL_TASKS} {tasks.length}</span>
            <span>{TEXTS.TASK_LIST.COMPLETED_TASKS} {tasks.filter(t => t.completed).length}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {sortedTasks.length === 0 ? (
            <p className="px-6 py-3 text-sm text-muted-foreground">
              {TEXTS.TASK_LIST.NO_TASKS_MESSAGE}
            </p>
          ) : (
            <ul className="max-h-80 overflow-auto task-list">
              {sortedTasks.map((task) => (
                <DraggableTaskItem
                  key={task.id}
                  task={task}
                  draggedTaskId={draggedTaskId}
                  dragOverTaskId={dragOverTaskId}
                  updatingPriorities={updatingPriorities}
                  canDrag={!updatingPriorities}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleCompleted={toggleCompleted}
                  onRemove={remove}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}


