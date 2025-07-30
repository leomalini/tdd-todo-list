import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";

const mockTodo: Todo = {
  id: "1",
  text: "Test todo",
  completed: false,
  createdAt: new Date("2024-01-01"),
};

const mockCompletedTodo: Todo = {
  id: "2",
  text: "Completed todo",
  completed: true,
  createdAt: new Date("2024-01-01"),
  completedAt: new Date("2024-01-02"),
};

describe("TodoItem", () => {
  it("should render todo text", () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("should render checkbox unchecked for incomplete todo", () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should render checkbox checked for completed todo", () => {
    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should call onToggle when checkbox is clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("should call onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("should show completed badge for completed todos", () => {
    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should apply line-through style for completed todos", () => {
    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const todoText = screen.getByText("Completed todo");
    expect(todoText).toHaveClass("line-through");
  });

  it("should not show completed badge for incomplete todos", () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });
});
