export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}