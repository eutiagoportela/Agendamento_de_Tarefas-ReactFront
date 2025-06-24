import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/helpers';
import { userService } from '../../services/userService';

export const EditProfileModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ PREENCHER DADOS DO USUÁRIO AO ABRIR MODAL
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nome: user.nome || user.Nome || '',
        email: user.email || user.Email || '',
        novaSenha: '',
        confirmarSenha: ''
      });
      setErrors({});
      setServerError('');
      setSuccessMessage('');
    }
  }, [isOpen, user]);

  // ✅ HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros quando usuário digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
    setSuccessMessage('');
  };

  // ✅ VALIDAR FORMULÁRIO
  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senhas (OBRIGATÓRIAS)
    if (!formData.novaSenha || formData.novaSenha.trim().length === 0) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (!validatePassword(formData.novaSenha)) {
      newErrors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha || formData.confirmarSenha.trim().length === 0) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      // Preparar dados para envio
      const updateData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.novaSenha.trim() // ✅ SEMPRE INCLUIR SENHA (OBRIGATÓRIA)
      };

      console.log('🔑 Senha sempre será enviada (campo obrigatório)');

      console.log('👤 Atualizando perfil:', updateData);

      // ✅ CHAMADA REAL PARA A API
      const result = await userService.updateProfile(updateData);

      if (result.success) {
        console.log('✅ Perfil atualizado com sucesso!');
        
        // Chamar callback de atualização com os novos dados
        if (onUpdateUser) {
          onUpdateUser(result.user);
        }

        setSuccessMessage(result.message || 'Perfil atualizado com sucesso!');
        
        // ✅ FORÇAR RELOAD DO DASHBOARD APÓS 2 SEGUNDOS
        setTimeout(() => {
          onClose();
          // Forçar reload completo da página para atualizar todos os dados
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Falha na atualização do perfil');
      }

    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      setServerError(error.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE CLOSE
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // ✅ TOGGLE SENHA VISIBILITY
  const toggleNovaSenhaVisibility = () => {
    setShowNovaSenha(prev => !prev);
  };

  const toggleConfirmarSenhaVisibility = () => {
    setShowConfirmarSenha(prev => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Editar Perfil
                </h3>
              </div>
              
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-6">
            
            {/* Mensagens de Status */}
            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{serverError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nome */}
              <div className="space-y-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full pl-10 pr-4 py-3 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 ${
                      errors.nome ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.nome && (
                  <p className="text-xs text-red-600 ml-1">{errors.nome}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full pl-10 pr-4 py-3 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Divisor */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  🔒 Confirme sua Senha (obrigatório)
                </h4>
              </div>

              {/* Nova Senha */}
              <div className="space-y-2">
                <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                  Nova Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="novaSenha"
                    name="novaSenha"
                    type={showNovaSenha ? "text" : "password"}
                    value={formData.novaSenha}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full pl-10 pr-12 py-3 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 ${
                      errors.novaSenha ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Digite sua nova senha (obrigatório)"
                  />
                  <button
                    type="button"
                    onClick={toggleNovaSenhaVisibility}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showNovaSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.novaSenha && (
                  <p className="text-xs text-red-600 ml-1">{errors.novaSenha}</p>
                )}
              </div>

              {/* Confirmar Nova Senha */}
              <div className="space-y-2">
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type={showConfirmarSenha ? "text" : "password"}
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={`w-full pl-10 pr-12 py-3 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 ${
                      errors.confirmarSenha ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmarSenhaVisibility}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showConfirmarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-xs text-red-600 ml-1">{errors.confirmarSenha}</p>
                )}
              </div>

              {/* Info sobre senha */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-700">
                      <strong>Senha obrigatória:</strong> Por motivos de segurança, você deve confirmar sua senha 
                      para salvar as alterações no perfil. A nova senha deve ter pelo menos 6 caracteres.
                    </p>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            
            {/* Botão Cancelar */}
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            {/* Botão Salvar */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};