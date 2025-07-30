import { useState, useEffect, useMemo } from "react";
import { Todo, TodoFilter } from "@/types/todo";

const STORAGE_KEY = "todos";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [loading, setLoading] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos).map((todo: Todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt
            ? new Date(todo.completedAt)
            : undefined,
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: trimmedText,
      completed: false,
      createdAt: new Date(),
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case "active":
          return !todo.completed;
        case "completed":
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const completedTodosCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  return {
    todos,
    filter,
    filteredTodos,
    activeTodosCount,
    completedTodosCount,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  };
};
