import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: todo.completed ? '#f0fdf4' : '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '8px',
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
      />
      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: '16px',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#6b7280' : '#111827',
          }}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            {todo.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Löschen
      </button>
    </div>
  );
}
