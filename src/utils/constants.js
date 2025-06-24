// Prioridades das tarefas (conforme enum do backend)
export const PRIORITIES = {
    BAIXA: 1,
    MEDIA: 2,
    ALTA: 3,
    URGENTE: 4
  };
  
  // Filtros de tarefas
  export const TASK_FILTERS = {
    ALL: 'all',
    PENDING: 'pending',
    COMPLETED: 'completed',
    OVERDUE: 'overdue'
  };
  
  export const FILTER_LABELS = {
    [TASK_FILTERS.ALL]: 'Todas',
    [TASK_FILTERS.PENDING]: 'Pendentes',
    [TASK_FILTERS.COMPLETED]: 'Concluídas',
    [TASK_FILTERS.OVERDUE]: 'Atrasadas'
  };