import React from 'react';
import { CheckCircle, Clock, AlertTriangle, List } from 'lucide-react';
import { getTasksStats } from '../../utils/helpers';

const TaskStats = ({ tasks = [] }) => {
  console.log('🔍 TaskStats - Recebendo tasks:', tasks);
  
  // ✅ DEBUG: Ver status de cada tarefa
  console.log('🔍 TaskStats - Status de cada tarefa:');
  tasks.forEach((task, index) => {
    console.log(`  Tarefa ${index + 1}:`, {
      titulo: task.titulo || task.Titulo,
      concluida: task.concluida,
      Concluida: task.Concluida,
      isCompleted: task.concluida === true || task.Concluida === true
    });
  });
  
  // Proteção extra contra erros
  let stats;
  try {
    stats = getTasksStats(tasks);
    console.log('🔍 TaskStats - Stats calculadas:', stats);
  } catch (error) {
    console.error('❌ Erro ao calcular stats:', error);
    // Fallback para stats vazias
    stats = {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0
    };
  }

  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: List,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Atrasadas',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`${item.bgColor} ${item.color} rounded-lg p-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;