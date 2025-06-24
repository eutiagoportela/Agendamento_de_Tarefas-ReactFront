import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, User, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/helpers';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!validatePassword(formData.senha)) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      console.log('📝 Criando conta...');
      const result = await register(formData.nome, formData.email, formData.senha);
      
      if (result.success) {
        console.log('✅ Conta criada com sucesso!');
        
        // ✅ MOSTRAR TOAST DE SUCESSO
        setShowSuccessToast(true);
        
        // ✅ REDIRECIONAR AUTOMATICAMENTE EM 2.5 SEGUNDOS
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        console.log('❌ Erro:', result.error);
        setServerError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      setServerError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <CheckSquare className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Criar Conta</h1>
            <p className="text-sm text-gray-500">Preencha os dados para se cadastrar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm">{serverError}</span>
              </div>
            )}

            {/* Nome */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    errors.nome ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Nome completo"
                />
              </div>
              {errors.nome && (
                <p className="text-xs text-red-600 ml-1">{errors.nome}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    errors.senha ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Senha (mín. 6 caracteres)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-xs text-red-600 ml-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    errors.confirmarSenha ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Confirmar senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-xs text-red-600 ml-1">{errors.confirmarSenha}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  CRIANDO CONTA...
                </div>
              ) : (
                'CRIAR CONTA'
              )}
            </button>

            {/* Link para Login */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-green-600 hover:text-green-500 underline transition-colors"
                >
                  Fazer Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ TOAST DE SUCESSO SIMPLES E BONITO */}
      {showSuccessToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop suave */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-500/10 to-teal-600/10 backdrop-blur-sm"></div>
          
          {/* Toast Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 transform animate-slide-bounce border-t-4 border-green-500">
            
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-6 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-4 right-8 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '0.9s' }}></div>
            </div>
            
            {/* Ícone de Sucesso grande e bonito */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-float">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            
            {/* Título com emoji */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-center mb-4">
              🎉 Sucesso!
            </h2>
            
            {/* Mensagem */}
            <div className="text-center mb-6">
              <p className="text-gray-700 text-lg font-medium mb-3">
                Sua conta foi criada com sucesso!
              </p>
              <p className="text-green-600 font-semibold text-base">
                ✨ Redirecionando para o login...
              </p>
            </div>
            
            {/* Pontos de carregamento */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

// ✅ ESTILOS CSS INJETADOS
if (typeof document !== 'undefined' && !document.querySelector('#register-toast-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'register-toast-styles';
  styleSheet.innerText = `
    @keyframes slideInBounce {
      0% {
        transform: scale(0.3) translateY(-100px) rotate(-10deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.05) translateY(10px) rotate(2deg);
        opacity: 1;
      }
      100% {
        transform: scale(1) translateY(0) rotate(0deg);
        opacity: 1;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    
    .animate-slide-bounce {
      animation: slideInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .animate-float {
      animation: float 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleSheet);
}