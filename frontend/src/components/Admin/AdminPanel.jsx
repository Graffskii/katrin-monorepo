import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreateModerator from './CreateModerator';
import UploadForm from './UploadForm';
import GalleryManager from './GalleryManager';

// Иконки для навигации (используем стандартные эмодзи, при желании можно заменить на SVG)
const ICONS = {
    dashboard: '📊',
    addModerator: '👥',
    upload: '📷',
    gallery: '🖼️',
    logout: '🚪'
  };

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
  };

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        alert('Изменения успешно опубликованы');
      } else {
        alert('Ошибка при публикации');
      }
    } catch (error) {
      console.error('Ошибка публикации:', error);
      alert('Ошибка при публикации');
    }
  };

  // Навигационные вкладки
  const navItems = [
    { id: 'dashboard', label: 'Панель управления', icon: ICONS.dashboard },
    ...(user && user.role === 'admin' ? [{ id: 'addModerator', label: 'Добавить модератора', icon: ICONS.addModerator }] : []),
    { id: 'upload', label: 'Загрузить фото', icon: ICONS.upload },
    { id: 'gallery', label: 'Управление галереей', icon: ICONS.gallery },
  ];

  // Рендеринг активного контента в зависимости от вкладки
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-playfair font-bold mb-4">Панель управления</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Быстрые действия</h3>
                <button 
                  onClick={handlePublish}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all mt-2"
                >
                  Опубликовать изменения
                </button>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Пользователь</h3>
                <p>Роль: {user?.role || 'Неизвестно'}</p>
                <p>Имя: {user?.username || 'Неизвестно'}</p>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Справка</h3>
                <p>Для загрузки фотографий перейдите во вкладку "Загрузить фото"</p>
              </div>
            </div>
          </div>
        );
      case 'addModerator':
        return <CreateModerator />;
      case 'upload':
        return <UploadForm />;
      case 'gallery':
        return <GalleryManager />;
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      {/* Боковая панель */}
      <div className="w-64 bg-gray-800 text-white min-h-screen shadow-lg">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-playfair font-bold">Админ-панель</h1>
          <p className="text-gray-400 text-sm">{user?.role === 'admin' ? 'Администратор' : 'Модератор'}</p>
        </div>
        
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors ${
                    activeTab === item.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
            <li className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 flex items-center space-x-3 text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors"
              >
                <span className="text-lg">{ICONS.logout}</span>
                <span>Выйти</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;