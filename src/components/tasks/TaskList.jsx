import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Edit3, 
  Trash2, 
  Calendar, 
  Bell, 
  AlertTriangle, 
  Loader2, 
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

// ✅ FUNÇÃO DE PRIORIDADES
const getPriorityInfo = (task) => {
  const prioridadeValue = task.prioridade || task.Prioridade;
  
  if (prioridadeValue === undefined || prioridadeValue === null) {
    return {
      number: 2,
      label: 'Média',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
  }

  let finalNumber = 2;
  
  if (typeof prioridadeValue === 'number') {
    finalNumber = prioridadeValue;
  }
  else if (typeof prioridadeValue === 'string') {
    switch (prioridadeValue.toLowerCase()) {
      case 'baixa':
      case '1':
        finalNumber = 1;
        break;
      case 'media':
      case 'média':
      case '2':
        finalNumber = 2;
        break;
      case 'alta':
      case '3':
        finalNumber = 3;
        break;
      case 'urgente':
      case '4':
        finalNumber = 4;
        break;
      default:
        finalNumber = 2;
    }
  }

  if (finalNumber < 1 || finalNumber > 4) {
    finalNumber = 2;
  }

  const priorityMap = {
    1: { label: 'Baixa', color: 'bg-green-100 text-green-800 border-green-200' },
    2: { label: 'Média', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    3: { label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    4: { label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-200' }
  };

  return {
    number: finalNumber,
    label: priorityMap[finalNumber].label,
    color: priorityMap[finalNumber].color
  };
};

// ✅ FUNÇÃO PARA VERIFICAR SE TAREFA ESTÁ CONCLUÍDA
const isTaskCompleted = (task) => {
  return task.concluida === true || task.Concluida === true;
};

// ✅ FUNÇÃO PARA VERIFICAR SE TAREFA ESTÁ ATRASADA
const isTaskOverdue = (task) => {
  if (isTaskCompleted(task)) return false;

  const dataConclusaoValue = task.dataConclusao || task.DataConclusao;
  if (!dataConclusaoValue) return false;

  const localDataString = dataConclusaoValue.replace('T', ' ').replace('Z', '');
  const dataConclusaoDate = new Date(localDataString);
  const now = new Date();

  return dataConclusaoDate < now;
};

// ✅ MODAL DE CONFIRMAÇÃO
const ConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle, type }) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const title = isDelete ? 'Deletar Tarefa' : 'Concluir Tarefa';
  const message = isDelete 
    ? `Tem certeza que deseja deletar a tarefa "${taskTitle}"?`
    : `Marcar "${taskTitle}" como concluída?`;
  const confirmText = isDelete ? 'Deletar' : 'Concluir';
  const confirmClass = isDelete 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPONENTE INDIVIDUAL DA TAREFA
const TaskItem = ({ task, onEdit, onDelete, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isCompleted = isTaskCompleted(task);
  const taskIsOverdue = isTaskOverdue(task);
  const priorityInfo = getPriorityInfo(task);

  const getBackgroundColor = () => {
    if (isCompleted) {
      return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400';
    } else if (taskIsOverdue) {
      return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400';
    } else {
      return 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400';
    }
  };

  const handleComplete = () => {
    if (isCompleted) return;
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmComplete = async () => {
    setShowConfirmModal(false);
    setIsCompleting(true);
    
    try {
      const taskId = task.id || task.Id;
      
      if (!taskId || typeof taskId === 'object') {
        throw new Error('ID da tarefa inválido para completar');
      }
      
      await onComplete(taskId);
    } catch (err) {
      console.error('Erro ao completar tarefa:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      const taskId = task.id || task.Id;
      
      if (!taskId || typeof taskId === 'object') {
        throw new Error('ID da tarefa inválido para deletar');
      }
      
      await onDelete(taskId);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
    }
  };

  const handleEdit = () => {
    if (!task || typeof task !== 'object') {
      console.error('❌ Tarefa inválida para edição:', task);
      return;
    }
    
    const taskId = task.id || task.Id;
    if (!taskId || typeof taskId === 'object') {
      console.error('❌ ID da tarefa inválido para edição:', taskId);
      return;
    }
    
    onEdit(task);
  };

  return (
    <>
      <div className={`p-4 transition-colors ${getBackgroundColor()} ${isCompleted ? 'opacity-75' : ''}`}>
        <div className="flex items-start space-x-3">
          <button
            onClick={handleComplete}
            disabled={isCompleting || isCompleted}
            className={`mt-1 p-1 rounded-full transition-colors ${
              isCompleted 
                ? 'text-green-600' 
                : 'text-gray-400 hover:text-green-600'
            } ${isCompleting ? 'animate-spin' : ''}`}
          >
            {isCompleting ? (
              <Loader2 className="h-5 w-5" />
            ) : isCompleted ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.titulo || task.Titulo}
                </h3>
                
                {(task.descricao || task.Descricao) && (
                  <p className={`mt-1 text-sm ${
                    isCompleted ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.descricao || task.Descricao}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(task.dataConclusao || task.DataConclusao)}</span>
                  </div>

                  {(task.dataLembrete || task.DataLembrete) && (
                    <div className="flex items-center text-xs text-blue-600">
                      <Bell className="h-3 w-3 mr-1" />
                      <span>
                        {(() => {
                          const dataLembrete = task.dataLembrete || task.DataLembrete;
                          const formatted = formatDate(dataLembrete);
                          
                          if (formatted === 'Hoje') {
                            try {
                              let hora;
                              
                              if (dataLembrete.includes('T')) {
                                const timepart = dataLembrete.split('T')[1];
                                if (timepart) {
                                  const hourMin = timepart.substring(0, 5);
                                  hora = hourMin;
                                } else {
                                  hora = '12:00';
                                }
                              } else {
                                const date = new Date(dataLembrete);
                                hora = date.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              }
                              
                              return `Lembrete: Hoje às ${hora}`;
                            } catch (error) {
                              console.error('❌ Erro ao formatar hora do lembrete:', error);
                              return `Lembrete: ${formatted}`;
                            }
                          }
                          
                          return `Lembrete: ${formatted}`;
                        })()}
                      </span>
                    </div>
                  )}

                  {taskIsOverdue && !isCompleted && (
                    <div className="flex items-center text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>Atrasada</span>
                    </div>
                  )}
                </div>
              </div>

              {!isCompleted && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar tarefa"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Deletar tarefa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmComplete}
        taskTitle={task.titulo || task.Titulo}
        type="complete"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        taskTitle={task.titulo || task.Titulo}
        type="delete"
      />
    </>
  );
};

// ✅ COMPONENTE PRINCIPAL LIMPO - SEM SISTEMA DE LEMBRETES
const TaskList = ({ tasks, loading, onEdit, onDelete, onComplete }) => {
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !isTaskCompleted(task);
      case 'completed':
        return isTaskCompleted(task);
      case 'overdue':
        return isTaskOverdue(task) && !isTaskCompleted(task);
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando tarefas...</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
          <p className="text-gray-600">Crie sua primeira tarefa para começar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Tarefas ({filteredTasks.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídas</option>
              <option value="overdue">Atrasadas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id || task.Id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Filter className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma tarefa encontrada para este filtro</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;