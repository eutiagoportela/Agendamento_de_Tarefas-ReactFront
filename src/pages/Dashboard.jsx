import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckSquare, LogOut, User, Plus, Search, X, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { EditProfileModal } from '../components/tasks/EditProfileModal';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import ReminderSimple from '../components/reminders/ReminderSimple';
import NotificationContainer from '../components/ui/Notification';
import { taskService } from '../services/taskService';
import { useNotifications } from '../hooks/useNotifications';
import { getTasksStats } from '../utils/helpers';

const Dashboard = () => {
  // ===== STATES =====
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ===== HOOKS =====
  const { user, logout, updateUser } = useAuth();
  const { notifications, success, error, removeNotification } = useNotifications();

  // ===== FUNÇÃO PARA CARREGAR TAREFAS =====
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      console.log('📋 Dashboard: Carregando tarefas da API...');
      const data = await taskService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
      console.log('✅ Dashboard: Tarefas carregadas:', data.length);
      setApiError(null);
    } catch (err) {
      console.error('❌ Dashboard: Erro ao carregar tarefas:', err.message);
      
      // API offline - usar dados mock
      setApiError('API não conectada - Execute "dotnet run" na pasta da API');
      setTasks([
        {
          id: 1,
          Id: 1,
          titulo: 'Configurar API .NET',
          Titulo: 'Configurar API .NET',
          descricao: 'Executar "dotnet run" na pasta da API para conectar',
          Descricao: 'Executar "dotnet run" na pasta da API para conectar',
          prioridade: 3,
          Prioridade: 'Alta',
          concluida: false,
          Concluida: false,
          dataCriacao: new Date().toISOString(),
          DataCriacao: new Date().toISOString(),
        },
        {
          id: 2,
          Id: 2,
          titulo: 'Testar Frontend + Backend',
          Titulo: 'Testar Frontend + Backend',
          descricao: 'Integração React com API .NET funcionando',
          Descricao: 'Integração React com API .NET funcionando',
          prioridade: 2,
          Prioridade: 'Media',
          concluida: true,
          Concluida: true,
          dataCriacao: new Date().toISOString(),
          DataCriacao: new Date().toISOString(),
        },
        {
          id: 3,
          Id: 3,
          titulo: 'Sistema de Lembretes',
          Titulo: 'Sistema de Lembretes',
          descricao: 'Novo sistema com sino e modal funcionando perfeitamente',
          Descricao: 'Novo sistema com sino e modal funcionando perfeitamente',
          prioridade: 1,
          Prioridade: 'Baixa',
          concluida: true,
          Concluida: true,
          dataCriacao: new Date().toISOString(),
          DataCriacao: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== CARREGAR TAREFAS NA INICIALIZAÇÃO =====
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ===== CALCULAR ESTATÍSTICAS =====
  const stats = useMemo(() => {
    return getTasksStats(tasks);
  }, [tasks]);

  // ===== FILTRAR TAREFAS POR PESQUISA =====
  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) {
      return tasks;
    }
    
    return tasks.filter(task => {
      const titulo = (task.titulo || task.Titulo || '').toLowerCase();
      const descricao = (task.descricao || task.Descricao || '').toLowerCase();
      const termoBusca = searchTerm.toLowerCase().trim();
      
      return titulo.includes(termoBusca) || descricao.includes(termoBusca);
    });
  }, [tasks, searchTerm]);

  // ===== HANDLERS =====
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSubmitTask = useCallback(async (taskIdOrData, taskData = null) => {
    try {
      const isEditing = taskData !== null;
      
      if (isEditing) {
        const taskId = taskIdOrData;
        
        if (!taskId || typeof taskId === 'object' || taskId === '[object Object]') {
          console.error('❌ Dashboard: ID inválido para edição:', taskId);
          throw new Error('ID da tarefa inválido. Tente recarregar a página.');
        }
        
        console.log(`✏️ Dashboard: Editando tarefa ID ${taskId}:`, taskData);
        const result = await taskService.updateTask(taskId, taskData);
        
        if (result) {
          console.log('✅ Dashboard: Tarefa editada com sucesso!');
          setShowTaskForm(false);
          setEditingTask(null);
          await loadTasks();
          setTimeout(() => {
            success('Tarefa editada com sucesso!', '✅ Sucesso');
          }, 300);
          return { success: true };
        }
      } else {
        const newTaskData = taskIdOrData;
        
        console.log('🆕 Dashboard: Criando nova tarefa:', newTaskData);
        const result = await taskService.createTask(newTaskData);
        
        if (result) {
          console.log('✅ Dashboard: Tarefa criada com sucesso!');
          setShowTaskForm(false);
          setEditingTask(null);
          await loadTasks();
          setTimeout(() => {
            success('Tarefa criada com sucesso!', '✅ Sucesso');
          }, 300);
          return { success: true };
        }
      }
      
      throw new Error('Resposta inválida do servidor');
      
    } catch (err) {
      console.error('❌ Dashboard: Erro ao salvar tarefa:', err);
      error('Erro ao salvar tarefa', err.message || 'Verifique se a API está rodando');
      return { success: false, error: err.message };
    }
  }, [success, error, loadTasks]);

  const handleCompleteTask = useCallback(async (taskId) => {
    try {
      if (!taskId || typeof taskId === 'object') {
        console.error('❌ Dashboard: ID inválido para completar tarefa:', taskId);
        throw new Error('ID da tarefa inválido');
      }
      
      console.log('✅ Dashboard: Marcando tarefa como concluída:', taskId);
      const result = await taskService.completeTask(taskId);
      
      if (result) {
        console.log('✅ Dashboard: Tarefa concluída com sucesso!');
        await loadTasks();
        
        setTimeout(() => {
          success('Tarefa concluída!', '✅ Sucesso');
        }, 200);
      }
    } catch (err) {
      console.error('❌ Dashboard: Erro ao concluir tarefa:', err);
      error('Erro ao concluir tarefa', err.message || 'Verifique se a API está rodando');
    }
  }, [success, error, loadTasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      if (!taskId || typeof taskId === 'object') {
        console.error('❌ Dashboard: ID inválido para deletar tarefa:', taskId);
        throw new Error('ID da tarefa inválido');
      }
      
      console.log('🗑️ Dashboard: Deletando tarefa:', taskId);
      const result = await taskService.deleteTask(taskId);
      
      if (result) {
        console.log('✅ Dashboard: Tarefa deletada com sucesso!');
        setTasks(prev => prev.filter(task => {
          const currentTaskId = task.id || task.Id;
          return String(currentTaskId) !== String(taskId);
        }));
        
        setTimeout(() => {
          success('Tarefa deletada com sucesso!', '🗑️ Removida');
        }, 200);
      }
    } catch (err) {
      console.error('❌ Dashboard: Erro ao deletar tarefa:', err);
      error('Erro ao deletar tarefa', err.message || 'Verifique se a API está rodando');
      loadTasks();
    }
  }, [success, error, loadTasks]);

  const handleEditTask = useCallback((task) => {
    console.log('✏️ Dashboard: Iniciando edição da tarefa:', task);
    
    if (!task || typeof task !== 'object') {
      console.error('❌ Dashboard: Tarefa inválida recebida:', task);
      error('Erro ao abrir tarefa para edição', 'Dados da tarefa inválidos');
      return;
    }
    
    const taskId = task.id || task.Id;
    if (!taskId || typeof taskId === 'object') {
      console.error('❌ Dashboard: Tarefa sem ID válido:', { task, taskId });
      error('Erro ao abrir tarefa para edição', 'ID da tarefa não encontrado');
      return;
    }
    
    console.log('✅ Dashboard: Tarefa válida para edição. ID:', taskId);
    setEditingTask(task);
    setShowTaskForm(true);
  }, [error]);

  const handleCancelForm = useCallback(() => {
    setShowTaskForm(false);
    setEditingTask(null);
  }, []);

  const handleReconnect = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOpenNewTaskForm = useCallback(() => {
    setShowTaskForm(true);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // ===== LOADING STATE =====
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ORIGINAL ===== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
                <p className="text-sm text-gray-500">Gerenciador de Tarefas</p>
              </div>
            </div>

            {/* Menu do Usuário */}
            <div className="flex items-center gap-4">
              
              {/* Sistema de Lembretes */}
              <ReminderSimple 
                tasks={tasks || []} 
                onUpdateTasks={loadTasks}
              />

              {/* Ícone do Usuário CLICÁVEL + Informações */}
              <div className="flex items-center gap-3">
                
                {/* ÍCONE CLICÁVEL PARA EDITAR PERFIL */}
                <button
                  onClick={handleEditProfile}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar Perfil"
                >
                  <User className="h-5 w-5" />
                </button>

                {/* Informações do Usuário */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nome || user.Nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email || user.Email || 'email@exemplo.com'}
                  </p>
                </div>
                
              </div>

              {/* Separador */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Botão Logout */}
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
              
            </div>
          </div>
        </div>
      </header>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== AVISO SE API OFFLINE ===== */}
        {apiError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    API Offline - Usando dados de exemplo
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Execute <code className="bg-yellow-100 px-1 rounded">dotnet run</code> na pasta da API .NET para conectar</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleReconnect}
                className="ml-3 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
              >
                Reconectar
              </button>
            </div>
          </div>
        )}
        
        {/* ===== TÍTULO DA PÁGINA ===== */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Olá, {user.nome?.split(' ')[0] || user.Nome?.split(' ')[0] || 'Usuário'}! 👋
          </h2>
          <p className="text-gray-600">Gerencie suas tarefas de forma eficiente</p>
          
          {/* Status da API */}
          <div className="mt-2 flex items-center space-x-2">
            {!apiError ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">API Conectada</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-yellow-600 font-medium">Modo Offline</span>
              </>
            )}
          </div>
        </div>

        {/* ===== CARDS DE ESTATÍSTICAS ORIGINAIS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Tarefas Pendentes</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Concluídas</h3>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Atrasadas</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== ÁREA DE PESQUISA ===== */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Campo de Pesquisa */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar tarefas por título..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-600">
                  {filteredTasks.length} tarefa(s) encontrada(s) para "{searchTerm}"
                </p>
              )}
            </div>

            {/* Botão Nova Tarefa */}
            <button
              onClick={handleOpenNewTaskForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </button>
          </div>
        </div>

        {/* ===== ÁREA DAS TAREFAS ===== */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Minhas Tarefas</h3>
            <div className="text-sm text-gray-500">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'} total
            </div>
          </div>
          
          {/* Lista de Tarefas */}
          <TaskList
            tasks={filteredTasks || []}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        </div>
        
      </main>

      {/* ===== MODAIS ===== */}
      
      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        user={user}
        onUpdateUser={updateUser}
      />

      {/* Modal do Formulário de Tarefa */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={handleCancelForm}
        />
      )}
      
      {/* Sistema de Toasts */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Dashboard;