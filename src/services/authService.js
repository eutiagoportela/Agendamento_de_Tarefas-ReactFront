import axios from 'axios';

// ✅ CRIAR UM CLIENTE AXIOS ESPECÍFICO PARA LOGIN (SEM INTERCEPTORS)
const authApi = axios.create({
  baseURL: 'https://localhost:7000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ IMPORTAR A API NORMAL PARA OUTRAS OPERAÇÕES
import api from './api';

class AuthService {
  
  // ===== LOGIN =====
  async login(credentials) {
    try {
      console.log('🔐 Tentando fazer login...');
      
      // ✅ USAR O CLIENTE ESPECÍFICO PARA LOGIN
      const response = await authApi.post('/auth/login', {
        email: credentials.email,
        senha: credentials.password
      });

      console.log('📥 Resposta completa do login:', response);
      console.log('📄 Dados da resposta:', response.data);

      if (response.data?.Sucesso && response.data?.Dados) {
        const { Token, Usuario } = response.data.Dados;
        
        // ✅ SALVAR NO LOCALSTORAGE
        localStorage.setItem('token', Token);
        localStorage.setItem('user', JSON.stringify(Usuario));
        
        console.log('✅ Login realizado com sucesso!');
        console.log('👤 Usuário:', Usuario);
        
        return { success: true, user: Usuario };
      } else {
        const mensagemErro = response.data?.Mensagem || 'Erro no login';
        console.log('❌ Login falhou - Mensagem do backend:', mensagemErro);
        throw new Error(mensagemErro);
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // ✅ TRATAR ERROS DE LOGIN DE FORMA ESPECÍFICA
      if (error.response?.status === 401) {
        // Durante o login, 401 = credenciais inválidas
        // ✅ BUSCAR A MENSAGEM EXATA DO BACKEND
        const mensagemBackend = error.response.data?.Mensagem || 
                               error.response.data?.mensagem ||
                               error.response.data?.message;
        
        console.log('📄 Status 401 - Mensagem do backend:', mensagemBackend);
        console.log('📄 Dados completos do erro:', error.response.data);
        
        throw new Error(mensagemBackend || 'Email ou senha incorretos');
      } else if (error.response?.status === 400) {
        // Dados inválidos (formato de email, etc)
        const mensagemBackend = error.response.data?.Mensagem || 
                               error.response.data?.mensagem ||
                               error.response.data?.message;
        throw new Error(mensagemBackend || 'Dados inválidos');
      } else if (error.response?.status === 500) {
        // Erro interno do servidor
        const mensagemBackend = error.response.data?.Mensagem || 
                               error.response.data?.mensagem ||
                               error.response.data?.message;
        throw new Error(mensagemBackend || 'Erro interno do servidor');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        // Outros erros 4xx
        const mensagemBackend = error.response.data?.Mensagem || 
                               error.response.data?.mensagem ||
                               error.response.data?.message;
        throw new Error(mensagemBackend || 'Erro na solicitação');
      } else if (error.name === 'AxiosError' && error.message.includes('Network Error')) {
        // Erro de rede
        throw new Error('Não foi possível conectar com o servidor. Verifique se a API está rodando.');
      } else {
        // Outros erros genéricos
        throw new Error('Erro de conexão. Tente novamente.');
      }
    }
  }

  // ===== LOGOUT =====
  logout() {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // ✅ REDIRECIONAR PARA LOGIN
    window.location.href = '/login';
  }

  // ===== VERIFICAR SE ESTÁ LOGADO =====
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('❌ Não autenticado - Token ou usuário ausente');
      return false;
    }

    try {
      // ✅ VERIFICAR SE TOKEN NÃO EXPIROU (BÁSICO)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        console.log('❌ Token expirado');
        this.logout();
        return false;
      }
      
      console.log('✅ Usuário autenticado');
      return true;
    } catch (error) {
      console.log('❌ Token inválido:', error);
      this.logout();
      return false;
    }
  }

  // ===== OBTER USUÁRIO ATUAL =====
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
  }

  // ===== OBTER TOKEN =====
  getToken() {
    return localStorage.getItem('token');
  }

  // ===== VERIFICAR AUTENTICAÇÃO COM O BACKEND =====
  async validateWithBackend() {
    try {
      console.log('🔍 Validando autenticação com o backend...');
      const response = await api.get('/auth/teste');
      
      if (response.data?.Sucesso) {
        console.log('✅ Autenticação válida no backend');
        return true;
      } else {
        console.log('❌ Autenticação inválida no backend');
        this.logout();
        return false;
      }
    } catch (error) {
      console.log('❌ Erro ao validar com backend:', error.message);
      
      // ✅ SE FOR ERRO DE AUTH, O INTERCEPTOR JÁ CUIDOU
      if (error.isAuthError) {
        return false;
      }
      
      // ✅ OUTROS ERROS - MANTER LOGADO (PODE SER PROBLEMA DE REDE)
      return this.isAuthenticated();
    }
  }

  // ===== FORÇAR NOVA AUTENTICAÇÃO =====
  async requireAuth() {
    console.log('🛡️ Verificando autenticação obrigatória...');
    
    // ✅ 1. VERIFICAR LOCAL
    if (!this.isAuthenticated()) {
      console.log('❌ Não autenticado localmente');
      this.logout();
      return false;
    }
    
    // ✅ 2. VERIFICAR COM BACKEND
    const isValid = await this.validateWithBackend();
    if (!isValid) {
      console.log('❌ Autenticação inválida no servidor');
      return false;
    }
    
    console.log('✅ Autenticação confirmada');
    return true;
  }

  // ===== DEBUG =====
  debugAuth() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    console.log('🔍 DEBUG AUTH:');
    console.log('Token existe:', !!token);
    console.log('User existe:', !!user);
    console.log('Is Authenticated:', this.isAuthenticated());
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expira em:', new Date(payload.exp * 1000));
        console.log('Token válido:', payload.exp * 1000 > Date.now());
      } catch (e) {
        console.log('Erro ao decodificar token:', e);
      }
    }
    
    if (user) {
      console.log('User data:', user);
    }
  }
}

export default new AuthService();