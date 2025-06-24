import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // ✅ MOSTRAR LOADING ENQUANTO VERIFICA AUTENTICAÇÃO
  if (loading) {
    return <Loading message="Verificando autenticação..." />;
  }

  // ✅ SE NÃO ESTIVER AUTENTICADO, REDIRECIONAR PARA LOGIN
  if (!isAuthenticated()) {
    console.log('🚫 ProtectedRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // ✅ SE ESTIVER AUTENTICADO, MOSTRAR O COMPONENTE
  console.log('✅ ProtectedRoute: Usuário autenticado:', user?.Nome || user?.nome);
  return children;
};

export default ProtectedRoute;