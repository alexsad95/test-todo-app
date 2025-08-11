/**
 * Centralized text strings for the TODO application
 * This file contains all user-facing text to enable easy localization and maintenance
 */

export const TEXTS = {
  // Application metadata
  APP: {
    TITLE: "TODO",
    DESCRIPTION: "Organize your tasks with intelligence",
  },

  // Form labels and placeholders
  FORM: {
    TITLE_LABEL: "Title",
    TITLE_PLACEHOLDER: "e.g., Buy milk",
    CATEGORY_LABEL: "Category",
    CATEGORY_PLACEHOLDER: "Select a category",
    NO_CATEGORIES_AVAILABLE: "No categories available",
    ADD_TASK_BUTTON: "Add task",
    ADDING_BUTTON: "Adding...",
  },

  // Task list
  TASK_LIST: {
    CATEGORY_FILTER_LABEL: "Category:",
    ALL_CATEGORIES: "All categories",
    ALL: "All",
    REFRESH_BUTTON_TOOLTIP: "Refresh tasks",
    UNDO_BUTTON: "Undo",
    DRAG_TO_REORDER_TOOLTIP: "Drag to reorder",
    NO_TASKS_MESSAGE: "No tasks yet. Create your first task above!",
    TOTAL_TASKS: "Total:",
    COMPLETED_TASKS: "Done:",
  },

  // Error messages
  ERRORS: {
    CATEGORIES_UNAVAILABLE: "Categories are unavailable. Run migrations and seed",
    CREATE_TASK_FAILED: "Failed to create task. Check backend/DB",
    LOAD_CATEGORIES_FAILED: "Failed to load categories",
    LOAD_TASKS_FAILED: "Failed to load tasks. Check backend/DB",
    FAILED_TO_UPDATE_TASK: "Failed to update task",
    FAILED_TO_DELETE_TASK: "Failed to delete task",
    FAILED_TO_RESTORE_TASK: "Failed to restore task",
    FAILED_TO_UPDATE_PRIORITIES: "Failed to update priorities",
    FAILED_TO_UNDO_PRIORITIES: "Failed to undo priorities",
    FAILED_TO_FETCH_TASKS: "Failed to fetch tasks",
    FAILED_TO_FETCH_CATEGORIES: "Failed to fetch categories",
  },

  // API error messages
  API_ERRORS: {
    ID_REQUIRED: "id is required",
    TASKS_ARRAY_REQUIRED: "tasks array is required",
    NOT_FOUND: "Not found",
    FAILED_TO_DELETE: "Failed to delete",
    FAILED_TO_RESTORE: "Failed to restore task",
    FAILED_TO_UPDATE_PRIORITIES: "Failed to update priorities",
    FAILED_TO_UNDO_PRIORITIES: "Failed to undo priorities",
    FAILED_TO_CREATE: "Failed to create task",
  },

  // Console error messages
  CONSOLE_ERRORS: {
    FAILED_TO_RESTORE_TASK: "Failed to restore task:",
    FAILED_TO_UPDATE_PRIORITIES: "Failed to update priorities:",
    FAILED_TO_UNDO_PRIORITIES: "Failed to undo priorities:",
    ERROR_FETCHING_TASKS: "Error fetching tasks:",
    ERROR_CREATING_RESTORING_TASK: "Error creating/restoring task:",
    ERROR_UPDATING_TASK: "Error updating task:",
    ERROR_DELETING_TASK: "Error deleting task:",
    ERROR_UPDATING_PRIORITIES: "Error updating priorities:",
    ERROR_FETCHING_CATEGORIES: "Error fetching categories:",
  },

  // HTTP methods
  HTTP_METHODS: {
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
  },

  // Content types
  CONTENT_TYPES: {
    JSON: "application/json",
  },

  // Drag and drop
  DRAG_DROP: {
    EFFECT_ALLOWED: "move",
    DROP_EFFECT: "move",
    DATA_FORMAT: "text/plain",
  },

  // Actions
  ACTIONS: {
    RESTORE: "restore",
    UNDO_PRIORITIES: "undoPriorities",
  },

  // Filter values
  FILTERS: {
    DEFAULT: "all",
    NO_CATEGORIES: "no-categories",
  },

  // Cache options
  CACHE: {
    NO_STORE: "no-store",
  },
};
