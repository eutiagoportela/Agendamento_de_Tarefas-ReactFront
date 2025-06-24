import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ VERIFICAÇÃO SIMPLIFICADA
  useEffect(() => {
    if (authLoading) return;
    
    if (isAuthenticated() && user && (user.Nome || user.nome)) {
      console.log('✅ Usuário já autenticado, redirecionando...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate, authLoading]);

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
  };

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      console.log('🔐 Tentando fazer login...');
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        console.log('✅ Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        console.log('❌ Login falhou:', result.error);
        setServerError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
      setServerError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING STATE
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <CheckSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Login</h1>
            <p className="text-sm text-gray-500">Entre na sua conta</p>
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

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
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
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-0 border-b-2 bg-gray-50 focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.senha ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Senha"
                />
              </div>
              {errors.senha && (
                <p className="text-xs text-red-600 ml-1">{errors.senha}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  ENTRANDO...
                </div>
              ) : (
                'ENTRAR'
              )}
            </button>

            {/* Link para Registro */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-blue-600 hover:text-blue-500 underline transition-colors"
                >
                  Cadastrar-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;