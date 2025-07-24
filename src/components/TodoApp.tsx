import React, { useState } from 'react';
import { TodoFilter } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTodos } from '@/hooks/useTodos';
import { useAuth } from '@/hooks/useAuth';
import { TodoItem } from './TodoItem';

const TodoApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    todos,
    filter,
    filteredTodos,
    activeTodosCount,
    completedTodosCount,
    loading,
    addTodo: addTodoHook,
    toggleTodo,
    deleteTodo: deleteTodoHook,
    clearCompleted: clearCompletedHook,
    setFilter,
  } = useTodos(user?.id);

  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    const trimmedText = inputValue.trim();
    if (!trimmedText) return;

    addTodoHook(trimmedText);
    setInputValue('');
    toast({
      title: "Todo added",
      description: `"${trimmedText}" has been added to your list.`,
    });
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    deleteTodoHook(id);
    
    if (todoToDelete) {
      toast({
        title: "Todo deleted",
        description: `"${todoToDelete.text}" has been removed from your list.`,
      });
    }
  };

  const clearCompleted = () => {
    const completedCount = completedTodosCount;
    clearCompletedHook();
    
    if (completedCount > 0) {
      toast({
        title: "Completed todos cleared",
        description: `${completedCount} completed ${completedCount === 1 ? 'todo' : 'todos'} removed.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* User Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Manage your todos</p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="border-border hover:bg-accent"
          >
            Sign Out
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-todo-gradient bg-clip-text text-transparent mb-2">
            Todo List
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks efficiently with our modern todo app
          </p>
        </div>

        {/* Add Todo Input */}
        <Card className="p-6 mb-6 bg-todo-surface border-border">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 bg-background border-border focus:ring-primary"
            />
            <Button 
              onClick={addTodo} 
              className="bg-primary hover:bg-primary/90 shrink-0"
              disabled={!inputValue.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {(['all', 'active', 'completed'] as TodoFilter[]).map(filterType => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              onClick={() => setFilter(filterType)}
              className={filter === filterType ? 'bg-primary text-primary-foreground' : ''}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3 mb-6">
          {filteredTodos.length === 0 ? (
            <Card className="p-8 text-center bg-todo-surface border-border">
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "No todos yet. Add one above to get started!" 
                  : `No ${filter} todos.`}
              </p>
            </Card>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Footer Stats & Actions */}
        <Card className="p-4 bg-todo-surface border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
              {completedTodosCount > 0 && (
                <span className="ml-2">
                  • {completedTodosCount} completed
                </span>
              )}
            </div>
            {completedTodosCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompleted}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear completed
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TodoApp;