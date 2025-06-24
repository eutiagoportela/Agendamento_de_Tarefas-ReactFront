import axios from 'axios';

const API_BASE_URL = 'https://localhost:7000/api';

// ===== CRIAR INSTÂNCIA DO AXIOS =====
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===== INTERCEPTOR DE REQUEST - ADICIONAR TOKEN =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token adicionado à requisição:', token.substring(0, 50) + '...');
    } else {
      console.log('⚠️ Nenhum token encontrado no localStorage');
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// ===== INTERCEPTOR DE RESPONSE - CAPTURAR 401 =====
api.interceptors.response.use(
  (response) => {
    // ✅ REQUISIÇÃO BEM-SUCEDIDA
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log(`❌ ${error.response?.status || 'SEM_STATUS'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    
    // ✅ SE FOR 401 - TOKEN INVÁLIDO OU EXPIRADO
    if (error.response?.status === 401) {
      console.log('🚫 ERRO 401 - Token inválido ou expirado!');
      
      // ✅ LIMPAR DADOS DO USUÁRIO
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // ✅ MOSTRAR NOTIFICAÇÃO (OPCIONAL)
      console.log('🔄 Redirecionando para login...');
      
      // ✅ REDIRECIONAR PARA LOGIN
      // Verificar se não estamos já na página de login para evitar loop
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
      
      // ✅ CRIAR ERRO CUSTOMIZADO
      const customError = new Error('Sessão expirada. Faça login novamente.');
      customError.isAuthError = true;
      return Promise.reject(customError);
    }
    
    // ✅ OUTROS ERROS - REPASSAR NORMALMENTE
    return Promise.reject(error);
  }
);

// ===== FUNÇÃO PARA TESTAR CONEXÃO =====
export const testConnection = async () => {
  try {
    console.log('🧪 Testando conexão com a API...');
    const response = await api.get('/health');
    console.log('✅ API está online:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API está offline:', error.message);
    return false;
  }
};

// ===== FUNÇÃO PARA TESTAR AUTENTICAÇÃO =====
export const testAuth = async () => {
  try {
    console.log('🧪 Testando autenticação...');
    const response = await api.get('/auth/teste');
    console.log('✅ Autenticação válida:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Autenticação inválida:', error.message);
    return false;
  }
};

export default api;