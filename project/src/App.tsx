import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { AuthForm } from './components/AuthForm';
import { TodoList } from './components/TodoList';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {user ? (
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;