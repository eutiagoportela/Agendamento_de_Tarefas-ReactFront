import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/providers/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ✅ REMOVIDA A DIV COM CLASSE App QUE PODERIA CAUSAR LIMITAÇÕES */}
        <Routes>
          {/* ✅ ROTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ ROTAS PROTEGIDAS */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* ✅ REDIRECT ROOT PARA LOGIN */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* ✅ CATCH-ALL - QUALQUER ROTA INVÁLIDA VAI PARA LOGIN */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;