import { useState, useEffect } from 'react';
import { Todo } from './types/todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const completed = filter === 'all' ? undefined : filter === 'completed';
      const data = await fetchTodos(completed);
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Fehler beim Laden der Todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title: string, description: string) => {
    try {
      const newTodo = await createTodo({ title, description: description || undefined });
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError('Fehler beim Erstellen des Todos');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const updated = await updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updated : todo))
      );
    } catch (err) {
      setError('Fehler beim Aktualisieren des Todos');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Fehler beim Löschen des Todos');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          Todo App
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '32px',
          }}
        >
          {stats.active} offen, {stats.completed} erledigt
        </p>

        <TodoForm onSubmit={handleCreate} />

        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: filter === f ? '600' : '400',
                backgroundColor: filter === f ? '#3b82f6' : '#fff',
                color: filter === f ? '#fff' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Alle' : f === 'active' ? 'Offen' : 'Erledigt'}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Lade Todos...
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
