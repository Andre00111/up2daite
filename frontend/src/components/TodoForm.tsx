import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onSubmit: (title: string, description: string) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Was möchtest du erledigen?"
        style={{
          padding: '12px 16px',
          fontSize: '16px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          outline: 'none',
        }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschreibung (optional)"
        rows={2}
        style={{
          padding: '12px 16px',
          fontSize: '14px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          outline: 'none',
          resize: 'vertical',
        }}
      />
      <button
        type="submit"
        disabled={!title.trim()}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: title.trim() ? '#3b82f6' : '#9ca3af',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: title.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        Hinzufügen
      </button>
    </form>
  );
}
