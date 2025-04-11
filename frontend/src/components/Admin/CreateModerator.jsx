import React, { useState } from 'react';

const CreateModerator = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/create-moderator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        setMessage('Модератор успешно создан');
        setUsername('');
        setPassword('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Ошибка при создании модератора');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при создании модератора');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold mt-8">Создать нового модератора</h2>
      {message && (
        <div className={`mt-4 p-2 ${message.includes('успешно') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block">Имя пользователя:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full" 
            required 
          />
        </div>
        <div>
          <label className="block">Пароль:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full" 
            required 
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all"
        >
          Создать модератора
        </button>
      </form>
    </div>
  );
};

export default CreateModerator;