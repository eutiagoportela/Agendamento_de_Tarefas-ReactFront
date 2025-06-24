import api from './api';

// ===== EXPORTS DO TASKSERVICE - SEM O MÉTODO updateProfile =====
export const taskService = {
  // Listar todas as tarefas do usuário
  getTasks: async () => {
    try {
      console.log('📋 Buscando todas as tarefas...');
      const response = await api.get('/tarefa');
      console.log('📥 Resposta getTasks:', response);
      
      return response.data?.Sucesso ? response.data.Dados : [];
    } catch (error) {
      console.error('❌ Erro ao carregar tarefas:', error);
      throw new Error('Erro ao carregar tarefas: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Obter tarefa específica
  getTask: async (id) => {
    try {
      if (!id || typeof id === 'object') {
        throw new Error('ID da tarefa inválido');
      }
      
      console.log(`📋 Buscando tarefa ${id}...`);
      const response = await api.get(`/tarefa/${id}`);
      console.log('📥 Resposta getTask:', response);
      
      return response.data?.Sucesso ? response.data.Dados : null;
    } catch (error) {
      console.error('❌ Erro ao carregar tarefa:', error);
      throw new Error('Erro ao carregar tarefa: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Criar nova tarefa
  createTask: async (taskData) => {
    try {
      console.log('📝 Criando nova tarefa:', taskData);
      
      const response = await api.post('/tarefa', taskData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Resposta createTask:', response);
      
      return response.data?.Sucesso ? response.data.Dados : null;
    } catch (error) {
      console.error('❌ Erro ao criar tarefa:', error);
      if (error.response?.data?.Mensagem) {
        throw new Error(error.response.data.Mensagem);
      }
      throw new Error('Erro ao criar tarefa: ' + error.message);
    }
  },

  // Atualizar tarefa
  updateTask: async (id, taskData) => {
    try {
      if (!id || typeof id === 'object' || id === '[object Object]') {
        console.error('❌ ID inválido recebido:', { id, tipo: typeof id });
        throw new Error('ID da tarefa inválido para atualização');
      }
      
      const taskId = String(id).trim();
      if (!taskId || taskId === 'undefined' || taskId === 'null') {
        throw new Error('ID da tarefa não pode ser vazio');
      }
      
      console.log(`✏️ Atualizando tarefa ${taskId}:`, taskData);
      console.log('🔍 Tipo do ID:', typeof taskId, 'Valor:', taskId);
      
      if (!taskData || typeof taskData !== 'object') {
        throw new Error('Dados da tarefa inválidos');
      }
      
      const response = await api.put(`/tarefa/${taskId}`, taskData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📥 Resposta updateTask:', response);
      
      return response.data?.Sucesso ? response.data.Dados : null;
    } catch (error) {
      console.error('❌ Erro ao atualizar tarefa:', error);
      
      if (error.response?.status === 415) {
        throw new Error('Erro de formato: Verifique se os dados estão corretos');
      }
      
      if (error.response?.data?.Mensagem) {
        throw new Error(error.response.data.Mensagem);
      }
      throw new Error('Erro ao atualizar tarefa: ' + error.message);
    }
  },

  // Deletar tarefa
  deleteTask: async (id) => {
    try {
      if (!id || typeof id === 'object') {
        throw new Error('ID da tarefa inválido');
      }
      
      const taskId = String(id).trim();
      console.log(`🗑️ Deletando tarefa ${taskId}...`);
      
      const response = await api.delete(`/tarefa/${taskId}`);
      console.log('📥 Resposta deleteTask:', response);
      
      return response.data?.Sucesso;
    } catch (error) {
      console.error('❌ Erro ao deletar tarefa:', error);
      throw new Error('Erro ao deletar tarefa: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Marcar tarefa como concluída
  completeTask: async (id) => {
    try {
      if (!id || typeof id === 'object') {
        throw new Error('ID da tarefa inválido');
      }
      
      const taskId = String(id).trim();
      console.log(`✅ Marcando tarefa ${taskId} como concluída...`);
      
      const response = await api.patch(`/tarefa/${taskId}/concluir`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Resposta completeTask:', response);
      
      return response.data?.Sucesso ? response.data.Dados : null;
    } catch (error) {
      console.error('❌ Erro ao concluir tarefa:', error);
      throw new Error('Erro ao concluir tarefa: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Marcar lembrete como enviado
  markReminderAsSent: async (id) => {
    try {
      if (!id || typeof id === 'object') {
        throw new Error('ID da tarefa inválido');
      }
      
      const taskId = String(id).trim();
      if (!taskId || taskId === 'undefined' || taskId === 'null') {
        throw new Error('ID da tarefa não pode ser vazio');
      }
      
      console.log(`🔔 Marcando lembrete da tarefa ${taskId} como enviado...`);
      
      const response = await api.patch(`/tarefa/${taskId}/lembrete-enviado`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Resposta markReminderAsSent:', response);
      
      return response.data?.Sucesso ? response.data.Dados : null;
    } catch (error) {
      console.error('❌ Erro ao marcar lembrete como enviado:', error);
      throw new Error('Erro ao marcar lembrete como enviado: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Filtrar tarefas pendentes
  getPendingTasks: async () => {
    try {
      console.log('📋 Buscando tarefas pendentes...');
      const response = await api.get('/tarefa/pendentes');
      console.log('📥 Resposta getPendingTasks:', response);
      
      return response.data?.Sucesso ? response.data.Dados : [];
    } catch (error) {
      console.error('❌ Erro ao carregar tarefas pendentes:', error);
      throw new Error('Erro ao carregar tarefas pendentes: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Filtrar tarefas concluídas
  getCompletedTasks: async () => {
    try {
      console.log('📋 Buscando tarefas concluídas...');
      const response = await api.get('/tarefa/concluidas');
      console.log('📥 Resposta getCompletedTasks:', response);
      
      return response.data?.Sucesso ? response.data.Dados : [];
    } catch (error) {
      console.error('❌ Erro ao carregar tarefas concluídas:', error);
      throw new Error('Erro ao carregar tarefas concluídas: ' + (error.response?.data?.Mensagem || error.message));
    }
  },

  // Filtrar por prioridade
  getTasksByPriority: async (priority) => {
    try {
      console.log(`📋 Buscando tarefas com prioridade ${priority}...`);
      const response = await api.get(`/tarefa/prioridade/${priority}`);
      console.log('📥 Resposta getTasksByPriority:', response);
      
      return response.data?.Sucesso ? response.data.Dados : [];
    } catch (error) {
      console.error('❌ Erro ao filtrar tarefas por prioridade:', error);
      throw new Error('Erro ao filtrar tarefas por prioridade: ' + (error.response?.data?.Mensagem || error.message));
    }
  }
};