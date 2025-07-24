import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty todos array', () => {
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.filter).toBe('all');
  });

  it('should add a new todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Test todo');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should not add empty todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('   ');
    });
    
    expect(result.current.todos).toHaveLength(0);
  });

  it('should toggle todo completion', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });
    
    const todoId = result.current.todos[0].id;
    
    act(() => {
      result.current.toggleTodo(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.todos[0].completedAt).toBeDefined();
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });
    
    const todoId = result.current.todos[0].id;
    
    act(() => {
      result.current.deleteTodo(todoId);
    });
    
    expect(result.current.todos).toHaveLength(0);
  });

  it('should clear completed todos', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Todo 1');
      result.current.addTodo('Todo 2');
    });
    
    const firstTodoId = result.current.todos[0].id;
    
    act(() => {
      result.current.toggleTodo(firstTodoId);
    });
    
    act(() => {
      result.current.clearCompleted();
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Todo 2');
  });

  it('should filter todos correctly', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Active todo');
      result.current.addTodo('Completed todo');
    });
    
    const completedTodoId = result.current.todos[1].id;
    
    act(() => {
      result.current.toggleTodo(completedTodoId);
    });
    
    act(() => {
      result.current.setFilter('active');
    });
    
    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Active todo');
    
    act(() => {
      result.current.setFilter('completed');
    });
    
    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].text).toBe('Completed todo');
  });

  it('should persist todos in localStorage', () => {
    const { result: result1 } = renderHook(() => useTodos());
    
    act(() => {
      result1.current.addTodo('Persistent todo');
    });
    
    // Simulate page reload by creating new hook instance
    const { result: result2 } = renderHook(() => useTodos());
    
    expect(result2.current.todos).toHaveLength(1);
    expect(result2.current.todos[0].text).toBe('Persistent todo');
  });
});