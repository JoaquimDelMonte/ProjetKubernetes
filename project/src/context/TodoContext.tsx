import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo } from '../types';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedTodos = localStorage.getItem(`todos-${user.id}`);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } else {
      setTodos([]);
    }
  }, [user]);

  const saveTodos = (newTodos: Todo[]) => {
    if (user) {
      localStorage.setItem(`todos-${user.id}`, JSON.stringify(newTodos));
    }
  };

  const addTodo = (text: string) => {
    if (!user) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      userId: user.id,
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};