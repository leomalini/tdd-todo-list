import React from "react";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash2, Check } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  return (
    <Card
      className="p-4 bg-todo-surface hover:bg-todo-surface-hover transition-colors border-border"
      data-testid="todo-item"
    >
      <div className="flex items-center gap-3">
        <Checkbox
          data-testid="todo-checkbox"
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="data-[state=checked]:bg-todo-completed data-[state=checked]:border-todo-completed"
        />
        <span
          className={`flex-1 ${
            todo.completed
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {todo.text}
        </span>
        {todo.completed && (
          <Badge
            variant="secondary"
            className="bg-todo-completed/20 text-todo-completed"
          >
            <Check className="w-3 h-3 mr-1" />
            Done
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
