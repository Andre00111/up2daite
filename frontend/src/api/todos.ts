import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:58080';

export async function fetchTodos(completed?: boolean): Promise<Todo[]> {
  const params = completed !== undefined ? `?completed=${completed}` : '';
  const response = await fetch(`${API_BASE}/api/todos${params}`);
  if (!response.ok) throw new Error('Fehler beim Laden der Todos');
  return response.json();
}

export async function createTodo(data: CreateTodoRequest): Promise<Todo> {
  const response = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Fehler beim Erstellen des Todos');
  return response.json();
}

export async function updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
  const response = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Fehler beim Aktualisieren des Todos');
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Fehler beim Löschen des Todos');
}
