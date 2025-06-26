# 📋 Task Manager - Frontend React

Uma interface moderna e responsiva para gerenciamento de tarefas, construída com React 18 e tecnologias de ponta para proporcionar a melhor experiência do usuário.

## 🚀 Tecnologias Utilizadas

### **Core Frontend**
- **React 18** - Biblioteca principal para interface do usuário
- **JavaScript ES6+** - Linguagem de programação moderna
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Lucide React** - Biblioteca de ícones moderna e consistente

### **Tooling & Build**
- **Vite** - Build tool rápido e moderno
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatação automática de código
- **PostCSS** - Processamento de CSS

### **HTTP & State Management**
- **Axios** - Cliente HTTP para requisições à API
- **React Context** - Gerenciamento de estado global
- **LocalStorage** - Persistência de dados do usuário
- **Custom Hooks** - Lógica compartilhada e reutilizável

## 🎯 Funcionalidades do Sistema

### **🔐 Autenticação**
- **Login**: Autenticação segura com validação de campos
- **Registro**: Cadastro de usuários com verificação de email único
- **Logout**: Encerramento seguro de sessão
- **Proteção de Rotas**: Redirecionamento automático para usuários não autenticados
- **Persistência de Sessão**: Manutenção da sessão via localStorage

### **👤 Gestão de Perfil**
- **Edição de Perfil**: Atualização completa de dados do usuário
- **Alteração de Dados**: Nome, email e senha
- **Validações de Segurança**: Confirmação de senha obrigatória
- **Feedback Visual**: Estados de loading e mensagens de sucesso/erro

### **📋 Gerenciamento de Tarefas**
- **Cadastro de Tarefa**: Criação com título, descrição, data de vencimento e prioridade
- **Edição de Tarefa**: Modificação completa de dados da tarefa
- **Exclusão de Tarefa**: Remoção com confirmação
- **Conclusão de Tarefa**: Marcar tarefa como concluída
- **Visualização**: Lista organizada com status visuais

### **🔔 Sistema de Lembretes**
- **Lembrete Opcional**: Adicionar lembretes às tarefas
- **Notificações**: Alertas visuais para tarefas com lembrete
- **Marcar Lembrete**: Controle manual de lembretes lidos
- **Modal Interativo**: Detalhes completos da tarefa no lembrete

### **🔍 Busca e Filtros**
- **Busca em Tempo Real**: Por título e descrição
- **Filtros por Status**: Todas, pendentes, concluídas
- **Filtros por Prioridade**: Alta, média, baixa
- **Contadores Dinâmicos**: Estatísticas em tempo real

## 📱 Telas da Aplicação

### **Login** (`/login`)
![Login](https://github.com/user-attachments/assets/5ee405d9-eded-4b37-b3c2-eec6e06747f3)

### **Registro** (`/register`)
![Registro](https://github.com/user-attachments/assets/53d8f6fd-beca-41e1-963f-8e69e229ce8b)

### **Dashboard** (`/dashboard`)
![Dashboard](https://github.com/user-attachments/assets/666f6c79-2556-4bc6-8c84-397717825910)<br/>
![Filtros](https://github.com/user-attachments/assets/9df37da9-d8d2-4167-adcb-f012dd91edc2)<br/>
![Nova Tarefa](https://github.com/user-attachments/assets/20bcc0b1-e0bc-459e-ae89-5d481fb652d4)<br/>
![Editar Tarefa](https://github.com/user-attachments/assets/94571a51-c64f-4030-accf-6d93f78810ed)<br/>
![Lembretes](https://github.com/user-attachments/assets/eaa91ccb-fdbd-4c9e-81f0-53be978976a8)<br/>
![Modal Lembrete](https://github.com/user-attachments/assets/1c432cd2-6aac-43c3-8b3e-8b04dadabbad)<br/>
![Editar Perfil](https://github.com/user-attachments/assets/9024d243-1901-4bb7-bc59-ddea64423cbc)<br/>
![Excluir Tarefa](https://github.com/user-attachments/assets/935ba295-04db-4d12-92c3-becc4b4db7f9)<br/>
![Busca](https://github.com/user-attachments/assets/325098e8-8b35-4a06-9df9-63f60e5398d6)<br/>

## 🏗️ Estrutura do Projeto

```
📦 frontend/
├── 📂 public/                    # Assets estáticos
│   ├── 📄 favicon.ico           # Favicon da aplicação
│   ├── 📄 logo192.png           # Logo para PWA
│   └── 📄 manifest.json         # Configuração PWA
├── 📂 src/                      # Código fonte
│   ├── 📂 components/           # Componentes React
│   │   ├── 📂 ui/              # Componentes base
│   │   │   ├── 📄 Button.jsx   # Componente de botão
│   │   │   ├── 📄 Input.jsx    # Componente de input
│   │   │   ├── 📄 Modal.jsx    # Componente de modal
│   │   │   ├── 📄 Loading.jsx  # Componente de loading
│   │   │   └── 📄 Notification.jsx # Sistema de toasts
│   │   ├── 📂 layout/          # Componentes de layout
│   │   │   ├── 📄 Header.jsx   # Cabeçalho da aplicação
│   │   │   ├── 📄 Layout.jsx   # Wrapper principal
│   │   │   └── 📄 ProtectedRoute.jsx # Proteção de rotas
│   │   ├── 📂 tasks/           # Componentes de tarefas
│   │   │   ├── 📄 TaskList.jsx # Lista de tarefas
│   │   │   ├── 📄 TaskForm.jsx # Formulário de tarefa
│   │   │   ├── 📄 TaskCard.jsx # Card de tarefa individual
│   │   │   ├── 📄 TaskStats.jsx # Estatísticas
│   │   │   └── 📄 EditProfileModal.jsx # Edição de perfil
│   │   ├── 📂 reminders/       # Sistema de lembretes
│   │   │   ├── 📄 ReminderSimple.jsx # Componente principal
│   │   │   └── 📄 ReminderModal.jsx  # Modal de lembrete
│   │   └── 📂 auth/            # Componentes de autenticação
│   │       ├── 📄 LoginForm.jsx # Formulário de login
│   │       └── 📄 RegisterForm.jsx # Formulário de cadastro
│   ├── 📂 hooks/               # Custom Hooks
│   │   ├── 📄 useAuth.js       # Hook de autenticação
│   │   ├── 📄 useNotifications.js # Hook de notificações
│   │   └── 📄 useLocalStorage.js  # Hook de localStorage
│   ├── 📂 services/            # Serviços de API
│   │   ├── 📄 api.js           # Configuração do Axios
│   │   ├── 📄 authService.js   # Serviços de autenticação
│   │   ├── 📄 taskService.js   # Serviços de tarefas
│   │   └── 📄 userService.js   # Serviços de usuário
│   ├── 📂 utils/               # Utilitários
│   │   ├── 📄 helpers.js       # Funções auxiliares
│   │   ├── 📄 validators.js    # Validadores
│   │   ├── 📄 formatters.js    # Formatadores
│   │   └── 📄 constants.js     # Constantes
│   ├── 📂 pages/               # Páginas da aplicação
│   │   ├── 📄 Login.jsx        # Página de login
│   │   ├── 📄 Register.jsx     # Página de cadastro
│   │   ├── 📄 Dashboard.jsx    # Dashboard principal
│   │   └── 📄 NotFound.jsx     # Página 404
│   ├── 📂 contexts/            # React Contexts
│   │   └── 📄 AuthContext.jsx  # Context de autenticação
│   ├── 📄 App.jsx              # Componente raiz
│   ├── 📄 index.js             # Entry point
│   └── 📄 index.css            # Estilos base
├── 📄 .env.example             # Exemplo de variáveis de ambiente
├── 📄 .env.local               # Variáveis de ambiente (local)
├── 📄 package.json             # Dependências e scripts
├── 📄 tailwind.config.js       # Configuração do Tailwind
├── 📄 vite.config.js           # Configuração do Vite
└── 📄 README.md                # Documentação
```

## 🧩 Arquitetura de Componentes

### **📦 Componentes por Responsabilidade**
```
├── ui/              # 🎨 Componentes base reutilizáveis
├── layout/          # 🏗️ Estrutura da aplicação
├── tasks/           # 📋 Componentes específicos de tarefas
├── reminders/       # 🔔 Sistema de lembretes
└── auth/            # 🔐 Componentes de autenticação
```

### **🎣 Custom Hooks Especializados**
```
├── useAuth          # 🔐 Autenticação e autorização
├── useNotifications # 📢 Sistema de notificações
└── useLocalStorage  # 💾 Persistência local
```

### **🌐 Camada de Serviços**
```
├── api.js           # ⚙️ Configuração base do Axios
├── authService.js   # 🔐 Serviços de autenticação
├── taskService.js   # 📋 Serviços de tarefas
└── userService.js   # 👤 Serviços de usuário
```

## 📥 Instalação e Configuração

### **1. Pré-requisitos**
```bash
# Verificar versões necessárias
node --version    # v18.0.0+ requerido
npm --version     # v8.0.0+ requerido
```

### **2. Clone e Instalação**
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/task-manager-frontend.git
cd task-manager-frontend

# Instalar dependências
npm install
# ou
yarn install
```

### **3. Configuração de Ambiente**
```bash
# Criar arquivo de ambiente
cp .env.example .env.local

# Configurar variáveis (editar .env.local)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Task Manager
REACT_APP_VERSION=1.0.0
```

### **4. Executar em Desenvolvimento**
```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
yarn dev

# Aplicação disponível em:
# http://localhost:3000
```

## 🌐 URLs da Aplicação

- **Desenvolvimento**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Cadastro**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard

## ⚡ Performance & Otimização

### **Características Implementadas**
- ✅ **Lazy loading** - Componentes carregados sob demanda
- ✅ **Memoização** - React.memo em componentes pesados
- ✅ **Debounce** - Otimização de busca em tempo real
- ✅ **Code splitting** - Bundles otimizados
- ✅ **Cache inteligente** - Dados persistidos localmente
- ✅ **Fast refresh** - Desenvolvimento otimizado com Vite

## 🎨 Interface & UX

### **Características de Design**
- ✅ **Design responsivo** - Mobile-first com Tailwind CSS
- ✅ **Estados de loading** - Feedback durante requisições
- ✅ **Sistema de notificações** - Toasts para ações do usuário
- ✅ **Modais interativos** - Formulários e confirmações
- ✅ **Indicadores visuais** - Status da API, contadores, badges
- ✅ **Acessibilidade** - Labels apropriados, contrast ratios

  ##BackEnd:
  - Se encontra em: https://github.com/eutiagoportela/Agendamento_de_Tarefas_API.Net-BackEnd
