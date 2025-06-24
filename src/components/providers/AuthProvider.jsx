import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLocalAuth = authService.isAuthenticated();
        if (!isLocalAuth) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
        
      } catch (error) {
        console.error('Erro na verificação de auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      const result = await authService.login({ email, password: senha });
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: 'Erro no login' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ✅ CORRIGIDO: Usar endpoint correto /usuario/registrar
  const register = async (nome, email, senha) => {
    try {
      console.log('📝 AuthProvider: Tentando registrar usuário...');
      console.log('📝 Dados:', { nome, email });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://localhost:7000/api'}/usuario/registrar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          Nome: nome, 
          Email: email, 
          Senha: senha 
        })
      });
      
      console.log('📥 Resposta do servidor:', response.status, response.statusText);
      
      // ✅ VERIFICAR SE A RESPOSTA É JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Resposta não é JSON:', contentType);
        throw new Error('Servidor retornou resposta inválida. Verifique se a API está funcionando.');
      }
      
      const data = await response.json();
      console.log('📄 Dados recebidos:', data);
      
      if (data.Sucesso || response.ok) {
        console.log('✅ Usuário registrado com sucesso!');
        return { success: true };
      } else {
        const errorMessage = data.Mensagem || data.message || 'Erro ao criar usuário';
        console.error('❌ Erro do servidor:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Erro na função register:', error);
      
      // ✅ TRATAR DIFERENTES TIPOS DE ERRO
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Erro de conexão. Verifique se a API está rodando.' 
        };
      }
      
      if (error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Não foi possível conectar com o servidor. Verifique se a API está rodando.' 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Erro inesperado ao criar conta' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated() && user !== null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};