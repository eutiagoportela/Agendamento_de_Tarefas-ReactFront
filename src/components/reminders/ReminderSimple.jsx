import React, { useState, useCallback, useMemo } from 'react';
import { Bell, X, Calendar, CheckCircle, Clock } from 'lucide-react';
import { taskService } from '../../services/taskService';

const ReminderSimple = ({ tasks = [], onUpdateTasks }) => {
  const [showReminderList, setShowReminderList] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  // ✅ FUNÇÃO PARA VERIFICAR SE LEMBRETE DEVE SER EXIBIDO - ESTÁVEL
  const shouldShowReminder = useCallback((task) => {
    // 1. Não mostrar se tarefa está concluída
    if (task.concluida === true || task.Concluida === true) {
      return false;
    }
    
    // 2. Não mostrar se não tem data de lembrete
    const dataLembreteValue = task.dataLembrete || task.DataLembrete;
    if (!dataLembreteValue) {
      return false;
    }
    
    // 3. Não mostrar se lembrete já foi enviado/lido
    if (task.LembreteEnviado === true || task.lembreteEnviado === true) {
      return false;
    }
    
    // 4. Só mostrar se a data/hora do lembrete chegou
    try {
      const localDataString = dataLembreteValue.replace('T', ' ').replace('Z', '');
      const dataLembreteDate = new Date(localDataString);
      const now = new Date();
      
      return dataLembreteDate <= now;
    } catch (error) {
      console.error('❌ Erro ao verificar lembrete:', error);
      return false;
    }
  }, []);

  // ✅ MEMOIZAR LISTA DE TAREFAS COM LEMBRETES - EVITA RECÁLCULO DESNECESSÁRIO
  const tasksWithReminders = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(task => shouldShowReminder(task));
  }, [tasks, shouldShowReminder]);

  // ✅ FUNÇÃO PARA OBTER PRIORIDADE - ESTÁVEL
  const getPriorityInfo = useCallback((task) => {
    const prioridadeValue = task.prioridade || task.Prioridade;
    
    if (prioridadeValue === undefined || prioridadeValue === null) {
      return { label: 'Média', color: 'bg-yellow-100 text-yellow-800' };
    }

    let finalNumber = 2;
    
    if (typeof prioridadeValue === 'number') {
      finalNumber = prioridadeValue;
    } else if (typeof prioridadeValue === 'string') {
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

    const priorityMap = {
      1: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
      2: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
      4: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
    };

    return priorityMap[finalNumber] || priorityMap[2];
  }, []);

  // ✅ FUNÇÃO PARA OBTER HORA DO LEMBRETE - ESTÁVEL
  const getReminderTime = useCallback((task) => {
    try {
      const dataLembrete = task.dataLembrete || task.DataLembrete;
      const localDataString = dataLembrete.replace('T', ' ').replace('Z', '');
      const date = new Date(localDataString);
      
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('❌ Erro ao formatar hora do lembrete:', error);
      return '00:00';
    }
  }, []);

  // ✅ FUNÇÃO PARA ABRIR MODAL DE CONFIRMAÇÃO - ESTÁVEL
  const handleTaskClick = useCallback((task) => {
    console.log('🔔 Clicou na tarefa do lembrete:', task.id || task.Id);
    setSelectedTask(task);
    setShowConfirmModal(true);
  }, []);

  // ✅ FUNÇÃO PARA FECHAR MODAL - ESTÁVEL
  const handleCloseModal = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedTask(null);
  }, []);

  // ✅ FUNÇÃO PARA CONFIRMAR LEITURA - ESTÁVEL
  const handleConfirmRead = useCallback(async () => {
    if (!selectedTask) return;
    
    setIsMarkingAsRead(true);
    
    try {
      const taskId = selectedTask.id || selectedTask.Id;
      console.log('✅ Confirmando leitura da tarefa:', taskId);
      
      // ✅ SÓ MARCA COMO LIDO QUANDO USUÁRIO CONFIRMA
      await taskService.markReminderAsSent(taskId);
      
      console.log('✅ Lembrete marcado como lido com sucesso!');
      
      // Fechar modal
      setShowConfirmModal(false);
      setSelectedTask(null);
      
      // ✅ ATUALIZAR LISTA APENAS APÓS CONFIRMAÇÃO DO USUÁRIO
      if (onUpdateTasks && typeof onUpdateTasks === 'function') {
        await onUpdateTasks();
      }
      
    } catch (error) {
      console.error('❌ Erro ao confirmar leitura:', error);
      alert('Erro ao confirmar leitura: ' + error.message);
    } finally {
      setIsMarkingAsRead(false);
    }
  }, [selectedTask, onUpdateTasks]);

  // ✅ TOGGLE DA LISTA DE LEMBRETES - ESTÁVEL
  const toggleReminderList = useCallback(() => {
    setShowReminderList(prev => !prev);
  }, []);

  // ✅ FECHAR LISTA DE LEMBRETES - ESTÁVEL
  const closeReminderList = useCallback(() => {
    setShowReminderList(false);
  }, []);

  return (
    <>
      <div className="relative">
        {/* ✅ BOTÃO VER LEMBRETES */}
        <button
          onClick={toggleReminderList}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            tasksWithReminders.length > 0
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'
              : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200'
          }`}
          title="Ver Lembretes"
        >
          <Bell className="h-4 w-4" />
          <span>Ver Lembretes</span>
          
          {/* Badge com número de lembretes */}
          {tasksWithReminders.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-1">
              {tasksWithReminders.length > 9 ? '9+' : tasksWithReminders.length}
            </span>
          )}
        </button>

        {/* ✅ PAINEL DE LEMBRETES */}
        {showReminderList && (
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
            
            {/* ✅ HEADER AZUL */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span className="font-medium">Lembretes ({tasksWithReminders.length})</span>
              </div>
              <button
                onClick={closeReminderList}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ✅ LISTA DE LEMBRETES */}
            <div className="max-h-96 overflow-y-auto">
              {tasksWithReminders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Nenhum lembrete pendente</p>
                  <p className="text-xs mt-1">Lembretes aparecerão aqui quando chegarem</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {tasksWithReminders.map((task) => {
                    const taskId = task.id || task.Id;
                    const priorityInfo = getPriorityInfo(task);
                    const reminderTime = getReminderTime(task);
                    
                    return (
                      <div 
                        key={taskId} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                        title="Clique para confirmar leitura"
                      >
                        {/* ✅ HEADER DO LEMBRETE */}
                        <div className="flex items-center space-x-2 mb-3">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            Lembrete {reminderTime}
                          </span>
                        </div>

                        {/* ✅ TÍTULO E DESCRIÇÃO */}
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {task.titulo || task.Titulo}
                          </h4>
                          {(task.descricao || task.Descricao) && (
                            <p className="text-sm text-gray-600">
                              {task.descricao || task.Descricao}
                            </p>
                          )}
                        </div>

                        {/* ✅ FOOTER COM PRIORIDADE E DATA */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {/* Badge de Prioridade */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </span>
                            
                            {/* Data */}
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Hoje</span>
                            </div>
                          </div>

                          {/* ✅ INDICADOR VISUAL DE CLIQUE */}
                          <div className="text-blue-600 text-sm font-medium">
                            📖 Clique para confirmar
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ MODAL DE CONFIRMAÇÃO */}
      {showConfirmModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">🔔 Lembrete</h3>
                    <p className="text-blue-100 text-sm">Confirmar leitura da tarefa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedTask.titulo || selectedTask.Titulo}
                </h4>
                
                {(selectedTask.descricao || selectedTask.Descricao) && (
                  <p className="text-gray-600 mb-3">
                    {selectedTask.descricao || selectedTask.Descricao}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(selectedTask.dataLembrete || selectedTask.DataLembrete).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Você visualizou este lembrete?</strong>
                  <br />
                  Clique em "Confirmar Leitura" para remover este lembrete da lista.
                </p>
              </div>

              {/* ✅ BOTÕES: FECHAR OU CONFIRMAR LEITURA */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isMarkingAsRead}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fechar
                </button>
                
                <button
                  onClick={handleConfirmRead}
                  disabled={isMarkingAsRead}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isMarkingAsRead ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirmar Leitura</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReminderSimple;