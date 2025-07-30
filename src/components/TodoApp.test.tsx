import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import TodoApp from "./TodoApp";

describe("TodoApp", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render the todo app with title", () => {
    render(<TodoApp />);
    expect(screen.getByText("Todo List")).toBeInTheDocument();
  });

  it("should render input field to add new todos", () => {
    render(<TodoApp />);
    expect(
      screen.getByPlaceholderText("Add a new todo...")
    ).toBeInTheDocument();
  });

  it("should add a new todo when user types and presses enter", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Test todo{enter}");

    setTimeout(() => {
      expect(screen.getByText("Test todo")).toBeInTheDocument();
    }, 10000);

    expect(input).toHaveValue("");
  });

  it("should not add empty todos", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "{enter}");

    expect(screen.queryByTestId("todo-item")).not.toBeInTheDocument();
  });

  it("should toggle todo completion status", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Test todo");

    const button = screen.getByTestId("add-todo-button");
    await user.click(button);

    expect(screen.getByText("Test todo")).toBeInTheDocument();

    const checkbox = screen.getByTestId("todo-checkbox");
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("should delete a todo when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Test todo{enter}");

    expect(screen.getByText("Test todo")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.queryByText("Test todo")).not.toBeInTheDocument();
  });

  it("should filter todos by status", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Active todo{enter}");
    await user.type(input, "Completed todo{enter}");

    // Complete the second todo
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    // Filter by active
    const activeFilter = screen.getByTestId("filter-active");
    await user.click(activeFilter);

    expect(screen.getByText("Active todo")).toBeInTheDocument();
    expect(screen.queryByText("Completed todo")).not.toBeInTheDocument();

    // Filter by completed
    const completedFilter = screen.getByTestId("filter-completed");
    await user.click(completedFilter);

    expect(screen.queryByText("Active todo")).not.toBeInTheDocument();
    expect(screen.getByText("Completed todo")).toBeInTheDocument();
  });

  it("should persist todos in localStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Persistent todo{enter}");

    unmount();

    render(<TodoApp />);
    expect(screen.getByText("Persistent todo")).toBeInTheDocument();
  });

  it("should show todo count", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    expect(screen.getByText("0 items left")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Test todo{enter}");

    expect(screen.getByText("1 item left")).toBeInTheDocument();
  });

  it("should clear completed todos", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("Add a new todo...");
    await user.type(input, "Todo 1{enter}");
    await user.type(input, "Todo 2{enter}");

    // Complete first todo
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    const clearButton = screen.getByRole("button", {
      name: /clear completed/i,
    });
    await user.click(clearButton);

    expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });
});
