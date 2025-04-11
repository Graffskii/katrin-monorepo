import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password); // предполагается, что login() внутри AuthContext делает запрос к бэку
      navigate('/admin');
    } catch (err) {
        console.log(err)
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Вход в админ-панель</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Логин</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="w-full p-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-2 border rounded" 
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
