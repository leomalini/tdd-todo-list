import { useState, useEffect, useMemo } from 'react';
import { Todo, TodoFilter } from '@/types/todo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTodos = (userId?: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load todos from Supabase
  const loadTodos = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos = data.map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        createdAt: new Date(todo.created_at),
        completedAt: todo.completed_at ? new Date(todo.completed_at) : undefined,
      }));

      setTodos(formattedTodos);
    } catch (error: any) {
      toast({
        title: "Error loading todos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos, userId]);

  const addTodo = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || !userId) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          text: trimmedText,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      const newTodo: Todo = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        createdAt: new Date(data.created_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      };

      setTodos(prev => [newTodo, ...prev]);
    } catch (error: any) {
      toast({
        title: "Error adding todo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || !userId) return;

    const completed = !todo.completed;
    const completedAt = completed ? new Date() : null;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          completed,
          completed_at: completedAt?.toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id
            ? {
                ...todo,
                completed,
                completedAt,
              }
            : todo
        )
      );
    } catch (error: any) {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearCompleted = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('user_id', userId)
        .eq('completed', true);

      if (error) throw error;

      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error: any) {
      toast({
        title: "Error clearing completed todos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => 
    todos.filter(todo => !todo.completed).length, [todos]);

  const completedTodosCount = useMemo(() => 
    todos.filter(todo => todo.completed).length, [todos]);

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