import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTodos } from "./useTodos";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useTodos", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty todos array", () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
    expect(result.current.filter).toBe("all");
  });

  it("should add a new todo", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Test todo");
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Test todo");
    expect(result.current.todos[0].completed).toBe(false);
  });

  it("should not add empty todo", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("   ");
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it("should toggle todo completion", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Test todo");
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.todos[0].completedAt).toBeDefined();
  });

  it("should delete a todo", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Test todo");
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it("should clear completed todos", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Todo 1");
      result.current.addTodo("Todo 2");
    });

    const firstTodoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(firstTodoId);
    });

    console.log(result.current.todos);

    act(() => {
      result.current.clearCompleted();
    });
    console.log(result.current.todos);

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Todo 2");
  });

  it("should filter todos correctly", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Active todo");
      result.current.addTodo("Completed todo");
    });

    const completedTodoId = result.current.todos[1].id;

    act(() => {
      result.current.toggleTodo(completedTodoId);
    });

    act(() => {
      result.current.setFilter("active");
    });

    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe("Active todo");

    act(() => {
      result.current.setFilter("completed");
    });

    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe("Completed todo");
  });

  it("should persist todos in localStorage", () => {
    const mockTodos = JSON.stringify([
      {
        id: "1",
        text: "Persistent todo",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    mockLocalStorage.setItem("todos", mockTodos);

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Persistent todo");
  });

  it("should save todos to localStorage when todos change", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("New todo");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "todos",
      expect.stringContaining("New todo")
    );
  });
});
