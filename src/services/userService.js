import api from './api';

// ===== USER SERVICE - OPERAÇÕES DE USUÁRIO =====
export const userService = {
  
  // ===== ATUALIZAR PERFIL DO USUÁRIO =====
  updateProfile: async (profileData) => {
    try {
      // ✅ OBTER ID DO USUÁRIO LOGADO
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuário não está logado');
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id || user.Id;
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }

      console.log('👤 Atualizando perfil do usuário ID:', userId);
      console.log('📝 Dados enviados:', profileData);

      // ✅ PREPARAR DADOS CONFORME A API ESPERA
      const requestData = {
        Nome: profileData.nome,
        Email: profileData.email
      };

      // ✅ ADICIONAR SENHA APENAS SE FORNECIDA (NÃO ENVIAR SE VAZIA)
      if (profileData.senha && profileData.senha.trim().length > 0) {
        requestData.Senha = profileData.senha;
        requestData.ConfirmarSenha = profileData.senha; // Backend espera confirmação
        console.log('🔑 Senha será alterada');
      } else {
        console.log('🔑 Senha não será alterada (não enviando campos de senha)');
      }

      console.log('🚀 Request final para API:', requestData);
      console.log('📋 Campos enviados:', Object.keys(requestData));

      // ✅ FAZER CHAMADA PARA A API
      const response = await api.put(`/usuario/${userId}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📥 Resposta da API:', response.data);

      // ✅ VERIFICAR SE A RESPOSTA FOI SUCESSO
      if (response.data?.Sucesso && response.data?.Dados) {
        const updatedUser = response.data.Dados;
        
        // ✅ ATUALIZAR DADOS NO LOCALSTORAGE
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const newUserData = {
          ...currentUser,
          nome: updatedUser.Nome,
          Nome: updatedUser.Nome,
          email: updatedUser.Email,
          Email: updatedUser.Email,
          // Manter outros dados que possam existir
          id: updatedUser.Id || currentUser.id,
          Id: updatedUser.Id || currentUser.Id
        };
        
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        console.log('✅ Perfil atualizado com sucesso!');
        console.log('👤 Novos dados do usuário:', newUserData);
        
        return {
          success: true,
          user: newUserData,
          message: response.data.Mensagem || 'Perfil atualizado com sucesso!'
        };
      } else {
        console.log('❌ Resposta inválida da API:', response.data);
        throw new Error(response.data?.Mensagem || 'Resposta inválida do servidor');
      }

    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      
      // ✅ TRATAR DIFERENTES TIPOS DE ERRO CONFORME SEU BACKEND
      if (error.response?.status === 400) {
        // Dados inválidos ou email já existe
        const mensagem = error.response.data?.Mensagem || 'Dados inválidos';
        throw new Error(mensagem);
      } else if (error.response?.status === 403) {
        // Acesso negado (tentando editar perfil de outro usuário)
        throw new Error('Acesso negado. Você só pode editar seu próprio perfil.');
      } else if (error.response?.status === 404) {
        // Usuário não encontrado
        throw new Error('Usuário não encontrado');
      } else if (error.response?.status === 409) {
        // Email já existe (conflito)
        throw new Error('Este email já está em uso por outro usuário');
      } else if (error.response?.status === 500) {
        // Erro interno do servidor
        throw new Error('Erro interno do servidor');
      } else if (error.message.includes('Network Error')) {
        // Erro de rede/conexão
        throw new Error('Não foi possível conectar com o servidor. Verifique se a API está rodando.');
      } else {
        // Outros erros
        throw new Error(error.message || 'Erro inesperado ao atualizar perfil');
      }
    }
  },

  // ===== OBTER PERFIL ATUAL =====
  getCurrentProfile: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Erro ao obter perfil atual:', error);
      return null;
    }
  },

  // ===== VERIFICAR SE USUÁRIO ESTÁ LOGADO =====
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
  },

  // ===== OBTER DADOS BÁSICOS DO USUÁRIO =====
  getUserBasicInfo: () => {
    const user = userService.getCurrentProfile();
    if (!user) return null;
    
    return {
      id: user.id || user.Id,
      nome: user.nome || user.Nome,
      email: user.email || user.Email
    };
  },

  // ===== LIMPAR DADOS DO USUÁRIO (LOGOUT) =====
  clearUserData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};