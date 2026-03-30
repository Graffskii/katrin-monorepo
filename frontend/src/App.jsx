import React, { useState, useEffect } from 'react';
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import AdminPanel from './components/Admin/AdminPanel';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import ScrollToTop from './components/ScrollToTop';

import ProductDetailPage from './pages/ProductDetailPage';
import FloatingWidgets from './components/FloatingWidgets';

import CategoryPage from './pages/CategoryPage';
import ProductListPage from './pages/ProductListPage';
import CatalogLandingPage from './pages/CatalogLandingPage';
import AppointmentPage from './pages/AppointmentPage';
import ContactsPage from './pages/ContactsPage';
import ServicesPage from './pages/ServicePage';
import ReviewsPage from './pages/ReviewsPage';
//import './assets/styles.css';

// Защищенный маршрут для админ-панели
const ProtectedRoute = ({ children }) => {
  const { user, logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const verifyToken = async () => {
          try {
              // Стучимся на бэкенд. Если токен протух, он вернет 403 Unauthorized
              const res = await fetch('/api/check-auth', { credentials: 'include' });
              if (res.ok) {
                  setIsAuthenticated(true);
              } else {
                  // Токен невалиден! Очищаем стейт и выкидываем на логин
                  logout();
                  setIsAuthenticated(false);
              }
          } catch (error) {
              console.error("Auth check failed", error);
              setIsAuthenticated(false);
          } finally {
              setIsChecking(false);
          }
      };

      if (user) {
          verifyToken();
      } else {
          setIsChecking(false);
      }
  }, [user, logout]);

  if (isChecking) {
      // Пока спрашиваем у сервера, показываем крутилку/заглушку, чтобы интерфейс не дергался
      return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Проверка доступа...</div>;
  }

  if (!user || !isAuthenticated) {
      return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative">
            <Routes>
              <Route path="/" element={<MainPage />} />

              <Route path="/catalog" element={<CatalogLandingPage />} />
              <Route path="/catalog/:categorySlug" element={<CategoryPage />} />
              <Route path="/catalog/:categorySlug/:subCategorySlug" element={<ProductListPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />

              <Route path="/products/:productId" element={<ProductDetailPage />} />

              <Route path="/appointment" element={<AppointmentPage />} />
              <Route path="/contacts" element={<ContactsPage />} />

              <Route path="/services" element={<ServicesPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />


              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }>
              </Route>
            </Routes>
            <FloatingWidgets />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;