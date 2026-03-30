import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CatalogManager from './CatalogManager';
import SimpleGalleryManager from './SimpleGalleryManager';

const ICONS = { catalog: '👗', reviews: '💬', brides: '👰', logout: '🚪', menu: '☰', close: '✕' };

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Состояние для мобильного меню

  const navItems = [
    // { id: 'dashboard', path: '/admin/dashboard', label: 'Дашборд (В будущем)', icon: ICONS.dashboard }, 
    { id: 'catalog', path: '/admin/catalog', label: 'Каталог платьев', icon: ICONS.catalog },
    { id: 'reviews', path: '/admin/reviews', label: 'Скриншоты отзывов', icon: ICONS.reviews },
    { id: 'brides', path: '/admin/brides', label: 'Галерея невест', icon: ICONS.brides },
  ];

  // Функция для смены вкладки с автозакрытием меню на мобилках
  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-poppins overflow-hidden">
      
      {/* --- МОБИЛЬНАЯ ШАПКА С БУРГЕРОМ --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-playfair font-bold">Katrin Admin</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl p-2">
          {isSidebarOpen ? ICONS.close : ICONS.menu}
        </button>
      </div>

      {/* --- БОКОВАЯ ПАНЕЛЬ (САЙДБАР) --- */}
      {/* На мобилках: выезжает слева. На ПК: всегда видима. */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full'}
      `}>
        <div className="hidden lg:block p-6 border-b border-gray-700">
          <h1 className="text-2xl font-playfair font-bold">Katrin Admin</h1>
          <p className="text-gray-400 text-sm mt-2">Пользователь: {user?.username}</p>
        </div>
        <nav className="flex-grow mt-4 overflow-y-auto">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
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

      {/* Затемнение фона на мобилках при открытом меню */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
            {activeTab === 'catalog' && <CatalogManager />}
            {activeTab === 'reviews' && <SimpleGalleryManager title="Скриншоты отзывов" apiPath="reviews" />}
            {activeTab === 'brides' && <SimpleGalleryManager title="Наши невесты" apiPath="brides" />}
        </div>
      </div>
    </div>
  );
};


export default AdminPanel;