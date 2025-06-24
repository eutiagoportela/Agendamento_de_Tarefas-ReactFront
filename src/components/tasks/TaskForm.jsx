import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, Info } from 'lucide-react';
import { validateTaskTitle } from '../../utils/helpers';

// ✅ FUNÇÕES UTILITÁRIAS FORA DO COMPONENTE (evita warning do ESLint)
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Se já está no formato correto YYYY-MM-DD, retornar
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Se é ISO string, extrair apenas a parte da data
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Tentar parsear e formatar
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return getTodayDateString();
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return getTodayDateString();
  }
};

const formatTimeForInput = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Corrigir diferença de fuso horário UTC para local
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};


const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: null,
    titulo: '',
    descricao: '',
    prioridade: 2, // Média como padrão
    dataConclusao: '',
    horaConclusao: '23:59',
    dataLembrete: '',
    horaLembrete: '',
    lembreteAtivo: true // ✅ MARCADO POR PADRÃO
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ INICIALIZAR FORMULÁRIO
useEffect(() => {
  if (!task) {
    // ✅ NOVA TAREFA
    const todayDate = getTodayDateString();
    const currentTime = getCurrentTimeString();
    
    setFormData({
      id: null,
      titulo: '',
      descricao: '',
      prioridade: 2,
      dataConclusao: todayDate,
      horaConclusao: '23:59',
      dataLembrete: todayDate,
      horaLembrete: currentTime,
      lembreteAtivo: true
    });
  } else {
    console.log("🔍 Dados recebidos para edição:", task); // DEBUG

    const taskId = task.id || task.Id;
    const titulo = task.titulo || task.Titulo || '';
    const descricao = task.descricao || task.Descricao || '';
    const prioridade = task.prioridade || task.Prioridade || 2;

    const dataConclusaoExistente = task.dataConclusao || task.DataConclusao;
    const dataLembreteExistente = task.dataLembrete || task.DataLembrete;

    const dataConclusao = dataConclusaoExistente 
      ? formatDateForInput(dataConclusaoExistente)
      : getTodayDateString();

    const horaConclusao = dataConclusaoExistente
      ? formatTimeForInput(dataConclusaoExistente)
      : '23:59';

    const dataLembrete = dataLembreteExistente
      ? formatDateForInput(dataLembreteExistente)
      : getTodayDateString();

    const horaLembrete = dataLembreteExistente
      ? formatTimeForInput(dataLembreteExistente)
      : getCurrentTimeString();

    setFormData({
      id: taskId,
      titulo,
      descricao,
      prioridade,
      dataConclusao,
      horaConclusao,
      dataLembrete,
      horaLembrete,
      lembreteAtivo: !!dataLembreteExistente
    });
  }
}, [task]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ✅ VALIDAÇÃO DO FORMULÁRIO
  const validateForm = () => {
    const newErrors = {};
    
    // Validar título
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (!validateTaskTitle(formData.titulo.trim())) {
      newErrors.titulo = 'Título deve ter pelo menos 3 caracteres';
    }
    
    // ✅ VALIDAR DATA DE CONCLUSÃO
    if (!formData.dataConclusao) {
      newErrors.dataConclusao = 'Data de conclusão é obrigatória';
    } else {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
      
      const dataSelecionada = new Date(formData.dataConclusao + 'T00:00:00');
      
      if (dataSelecionada < hoje) {
        const hojeFormatado = hoje.toLocaleDateString('pt-BR');
        newErrors.dataConclusao = `Data não pode ser anterior a ${hojeFormatado}`;
      }
    }
    
    // ✅ VALIDAR LEMBRETE SE ATIVO
    if (formData.dataLembrete && formData.horaLembrete) {
      const agora = new Date();

      try {
        const [hour, minute] = formData.horaLembrete.split(':');
        const [year, month, day] = formData.dataLembrete.split('-').map(Number);

        const dataHoraLembrete = new Date(year, month - 1, day, hour, minute);

        if (dataHoraLembrete < agora) {
          newErrors.dataLembrete = 'Lembrete deve ser para uma data/hora futura';
        }
      } catch (e) {
        newErrors.dataLembrete = 'Data ou hora do lembrete inválida: ' + e.message;
      }
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // ✅ PREPARAR DADOS PARA ENVIO - FORMATO UTC PARA POSTGRESQL
      const dataConclusaoCompleta = `${formData.dataConclusao}T${formData.horaConclusao}:00.000Z`; // ✅ Adicionar Z para UTC
      
      const dataLembreteCompleta = formData.lembreteAtivo && formData.dataLembrete && formData.horaLembrete
        ? `${formData.dataLembrete}T${formData.horaLembrete}:00.000Z` // ✅ Adicionar Z para UTC
        : dataConclusaoCompleta;
      
      const taskData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        prioridade: parseInt(formData.prioridade),
        dataConclusao: dataConclusaoCompleta,
        dataLembrete: dataLembreteCompleta
      };

      console.log('📤 Dados enviados (UTC):', taskData);

      let result;
      if (formData.id) {
        result = await onSubmit(formData.id, taskData);
      } else {
        result = await onSubmit(taskData);
      }

      if (result?.success !== false) {
        // onSubmit deve fechar o modal
      }
    } catch (error) {
      console.error('❌ Erro ao salvar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 1, label: 'Baixa', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 2, label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    { value: 3, label: 'Alta', color: 'bg-red-100 text-red-800', icon: '🔴' },
    { value: 4, label: 'Urgente', color: 'bg-purple-100 text-purple-800', icon: '🟣' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* ✅ HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {formData.id ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* ✅ FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* ✅ TÍTULO */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.titulo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o título da tarefa"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>

          {/* ✅ DESCRIÇÃO */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva sua tarefa (opcional)"
            />
          </div>

          {/* ✅ PRIORIDADE */}
          <div>
            <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade <span className="text-red-500">*</span>
            </label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ DATA E HORA DE CONCLUSÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataConclusao" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data de Conclusão <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dataConclusao"
                name="dataConclusao"
                value={formData.dataConclusao}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dataConclusao ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dataConclusao && (
                <p className="mt-1 text-sm text-red-600">{errors.dataConclusao}</p>
              )}
            </div>

            <div>
              <label htmlFor="horaConclusao" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Hora de Conclusão <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="horaConclusao"
                name="horaConclusao"
                value={formData.horaConclusao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Deixe em branco para horário automático
              </p>
            </div>
          </div>

          {/* ✅ LEMBRETE */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="lembreteAtivo"
                name="lembreteAtivo"
                checked={formData.lembreteAtivo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="lembreteAtivo" className="ml-2 text-sm font-medium text-gray-700">
                <Info className="inline h-4 w-4 mr-1" />
                Lembrete (Opcional)
              </label>
            </div>

            {formData.lembreteAtivo && (
              <>
                <div className="bg-blue-100 p-3 rounded mb-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Como funciona:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Qualquer data e horário são aceitos (igual à conclusão)</li>
                    <li>• Deve ser antes ou no mesmo horário da conclusão</li>
                    <li>• Deixe em branco para horário automático</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dataLembrete" className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Data do Lembrete
                    </label>
                    <input
                      type="date"
                      id="dataLembrete"
                      name="dataLembrete"
                      value={formData.dataLembrete}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dataLembrete ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dataLembrete && (
                      <p className="mt-1 text-sm text-red-600">{errors.dataLembrete}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="horaLembrete" className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Hora do Lembrete
                    </label>
                    <input
                      type="time"
                      id="horaLembrete"
                      name="horaLembrete"
                      value={formData.horaLembrete}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.horaLembrete ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.horaLembrete && (
                      <p className="mt-1 text-sm text-red-600">{errors.horaLembrete}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Opcional - deixe em branco para horário automático
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ✅ BOTÕES */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                formData.id ? 'Atualizar Tarefa' : 'Criar Tarefa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;