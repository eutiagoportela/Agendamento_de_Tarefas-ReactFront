export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  if (diffDays > 0) return `Em ${diffDays} dias`;
  
  return date.toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const formatTimeForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toTimeString().substring(0, 5);
};

// ✅ VALIDAÇÕES PARA LOGIN E REGISTER
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateTaskTitle = (title) => {
  return title && title.trim().length >= 3;
};

// Utilitários de classificação
export const sortTasksByPriority = (tasks) => {
  return [...tasks].sort((a, b) => b.prioridade - a.prioridade);
};

export const sortTasksByDate = (tasks) => {
  return [...tasks].sort((a, b) => new Date(a.dataConclusao) - new Date(b.dataConclusao));
};

// ✅ FUNÇÃO CORRIGIDA PARA VERIFICAR SE TAREFA ESTÁ ATRASADA
const isTaskCompleted = (task) => {
  return task.concluida === true || task.Concluida === true;
};

// ✅ FUNÇÃO CORRIGIDA - USA O MÉTODO QUE VOCÊ FORNECEU
const isTaskOverdue = (task) => {
  // ✅ 1. Se tarefa está concluída, não está atrasada
  if (isTaskCompleted(task)) return false;

  // ✅ 2. Se não tem data de conclusão, não está atrasada
  const dataConclusaoValue = task.dataConclusao || task.DataConclusao;
  if (!dataConclusaoValue) return false;

  // ✅ 3. TRATAMENTO CORRETO DA DATA (como você sugeriu)
  try {
    const localDataString = dataConclusaoValue.replace('T', ' ').replace('Z', '');
    const dataConclusaoDate = new Date(localDataString);
    const now = new Date();

    return dataConclusaoDate < now;
  } catch (error) {
    console.error('Erro ao verificar se tarefa está atrasada:', task, error);
    return false;
  }
};

// ✅ FUNÇÃO CORRIGIDA - Usa as funções auxiliares corrigidas
export const getTasksStats = (tasks) => {
  if (!Array.isArray(tasks)) {
    console.warn('getTasksStats: tasks não é um array:', tasks);
    return {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    };
  }

  console.log('📊 Calculando estatísticas para', tasks.length, 'tarefas');

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => isTaskCompleted(t)).length,
    pending: tasks.filter(t => !isTaskCompleted(t)).length,
    overdue: tasks.filter(t => isTaskOverdue(t)).length
  };

  console.log('📊 Estatísticas calculadas:', stats);
  
  // ✅ DEBUG: Mostrar quais tarefas estão atrasadas
  const overdueTasksDebug = tasks.filter(t => isTaskOverdue(t));
  console.log('🔍 Tarefas atrasadas encontradas:', overdueTasksDebug.map(t => ({
    id: t.id || t.Id,
    titulo: t.titulo || t.Titulo,
    dataConclusao: t.dataConclusao || t.DataConclusao,
    concluida: t.concluida || t.Concluida,
    isOverdue: isTaskOverdue(t)
  })));

  return stats;
};