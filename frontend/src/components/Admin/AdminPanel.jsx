import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CatalogManager from './CatalogManager'; // <-- Будет наш главный компонент

const ICONS = { catalog: '👗', logout: '🚪' };

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');

  const navItems = [
    { id: 'catalog', label: 'Управление каталогом', icon: ICONS.catalog },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      {/* Боковая панель */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-playfair font-bold">Katrin Admin</h1>
          <p className="text-gray-400 text-sm mt-2">Пользователь: {user?.username}</p>
        </div>
        <nav className="flex-grow mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition-colors ${
                    activeTab === item.id ? 'bg-primary border-l-4 border-white' : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={logout} className="p-6 flex items-center space-x-3 hover:bg-gray-700 transition-colors border-t border-gray-700">
            <span className="text-xl">{ICONS.logout}</span>
            <span>Выйти</span>
        </button>
      </div>

      {/* Основной контент */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'catalog' && <CatalogManager />}
      </div>
    </div>
  );
};

export default AdminPanel;