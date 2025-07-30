export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export type TodoFilter = "all" | "active" | "completed";

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}
