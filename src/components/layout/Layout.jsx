import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* ✅ LOGO E TÍTULO */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-xs text-gray-500">Gerenciador de Tarefas</p>
              </div>
            </div>

            {/* ✅ USER INFO E LOGOUT */}
            <div className="flex items-center space-x-4">
              {/* ✅ INFORMAÇÕES DO USUÁRIO */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.Nome || user?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.Email || user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </div>

              {/* ✅ BOTÃO DE LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;