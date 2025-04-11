import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import AdminPanel from './components/Admin/AdminPanel';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
//import './assets/styles.css';

// Защищенный маршрут для админ-панели
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;