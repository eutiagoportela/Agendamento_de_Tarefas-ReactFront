// config/env.js
export const config = {
  // ✅ URL da API baseada no ambiente
  API_URL: import.meta.env.VITE_API_URL || 'https://localhost:7000/api',
  
  // ✅ URLs dos endpoints específicos
  endpoints: {
    // Autenticação
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/usuario/registrar',
    
    // Tarefas
    TASKS: '/tarefa',
    TASK_BY_ID: (id) => `/tarefa/${id}`,
    TASK_COMPLETE: (id) => `/tarefa/${id}/concluir`,
    TASKS_PENDING: '/tarefa/pendentes',
    TASKS_COMPLETED: '/tarefa/concluidas',
    TASKS_BY_PRIORITY: (priority) => `/tarefa/prioridade/${priority}`,
    
    // Usuário
    USER_BY_ID: (id) => `/usuario/${id}`,
    USER_UPDATE: (id) => `/usuario/${id}`,
    USER_DELETE: (id) => `/usuario/${id}`
  },
  
  // ✅ Configurações da aplicação
  app: {
    NAME: import.meta.env.VITE_APP_NAME || 'Task Manager',
    VERSION: '1.0.0',
    ENVIRONMENT: import.meta.env.DEV ? 'development' : 'production'
  },
  
  // ✅ Configurações de timeout e limites
  timeouts: {
    API_TIMEOUT: 15000, // 15 segundos
    REMINDER_CHECK_INTERVAL: 30000, // 30 segundos
    NOTIFICATION_AUTO_CLOSE: 5000 // 5 segundos
  },
  
  // ✅ Configurações de validação
  validation: {
    MIN_PASSWORD_LENGTH: 6,
    MIN_TASK_TITLE_LENGTH: 3,
    MAX_TASK_TITLE_LENGTH: 100,
    MAX_TASK_DESCRIPTION_LENGTH: 500
  }
};

// ✅ Helper para debug
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

// ✅ Helper para logs condicionais
export const devLog = (...args) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

export const devError = (...args) => {
  if (isDevelopment()) {
    console.error(...args);
  }
};