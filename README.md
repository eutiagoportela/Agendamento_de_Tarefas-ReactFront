# 📋 Task Manager - Frontend React <br/><br/>
Uma interface moderna e responsiva para gerenciamento de tarefas, construída com React 18 e tecnologias de ponta para proporcionar a melhor experiência do usuário.<br/><br/>
🚀 Tecnologias Utilizadas<br/><br/>
Core Frontend<br/>

React 18 - Biblioteca principal para interface do usuário<br/>
JavaScript ES6+ - Linguagem de programação moderna<br/>
Tailwind CSS - Framework CSS utility-first para estilização<br/>
Lucide React - Biblioteca de ícones moderna e consistente<br/>

Tooling & Build<br/><br/>

Vite - Build tool rápido e moderno<br/>
ESLint - Linter para qualidade de código<br/>
Prettier - Formatação automática de código<br/>
PostCSS - Processamento de CSS<br/>

HTTP & State Management<br/><br/>

Axios - Cliente HTTP para requisições à API<br/>
React Context - Gerenciamento de estado global<br/>
LocalStorage - Persistência de dados do usuário<br/>
Custom Hooks - Lógica compartilhada e reutilizável<br/>

Validação & Forms<br/><br/>

Validação customizada - Validadores específicos para o domínio<br/>
Controlled Components - Formulários controlados pelo React<br/>
Real-time validation - Feedback instantâneo ao usuário<br/>

⚛️ Arquitetura Frontend<br/><br/>
🎯 Princípios Arquiteturais<br/>

Component-Driven Development - Desenvolvimento orientado a componentes<br/>
Separation of Concerns - Separação clara de responsabilidades<br/>
Single Responsibility Principle - Cada componente/hook com uma função específica<br/>
Custom Hooks Pattern - Lógica de negócio isolada e reutilizável<br/>
Service Layer - Abstração da comunicação com APIs<<br/>

# 🧩 Padrões de Componentização<br/><br/>
📦 Componentes por Responsabilidade<br/>
```
├── ui/              # 🎨 Componentes base reutilizáveis
│   ├── Button       # ← Botões padronizados
│   ├── Input        # ← Campos de entrada
│   ├── Modal        # ← Modais base
│   └── Loading      # ← Estados de carregamento
├── layout/          # 🏗️ Estrutura da aplicação
│   ├── Header       # ← Cabeçalho com navegação
│   ├── Sidebar     # ← Menu lateral (se necessário)
│   └── Layout       # ← Wrapper principal
├── tasks/           # 📋 Componentes específicos de tarefas
│   ├── TaskList     # ← Lista de tarefas
│   ├── TaskForm     # ← Formulário de criação/edição
│   ├── TaskCard     # ← Card individual de tarefa
│   └── TaskStats    # ← Estatísticas de tarefas
├── reminders/       # 🔔 Sistema de lembretes
│   ├── ReminderSimple # ← Componente principal de lembretes
│   └── ReminderModal  # ← Modal de lembrete ativo
└── auth/            # 🔐 Componentes de autenticação
    ├── LoginForm    # ← Formulário de login
    └── RegisterForm # ← Formulário de cadastro

🎣 Custom Hooks Especializados
javascript🔗 Hooks por Domínio
├── useAuth          # 🔐 Autenticação e autorização
│   ├── login()      # ← Realizar login
│   ├── logout()     # ← Realizar logout
│   ├── register()   # ← Cadastrar usuário
│   └── user         # ← Estado do usuário logado
├── useNotifications # 📢 Sistema de notificações
│   ├── success()    # ← Notificação de sucesso
│   ├── error()      # ← Notificação de erro
│   └── notifications # ← Lista de notificações ativas
└── useLocalStorage  # 💾 Persistência local
    ├── setItem()    # ← Salvar item
    ├── getItem()    # ← Recuperar item
    └── removeItem() # ← Remover item

🌐 Camada de Serviços
javascript📡 Services por Domínio
├── api.js           # ⚙️ Configuração base do Axios
│   ├── baseURL      # ← URL base da API
│   ├── interceptors # ← Interceptadores de request/response
│   └── headers      # ← Headers padrão (Authorization)
├── authService.js   # 🔐 Serviços de autenticação
│   ├── login()      # ← POST /auth/login
│   ├── register()   # ← POST /auth/register
│   └── refresh()    # ← POST /auth/refresh
├── taskService.js   # 📋 Serviços de tarefas
│   ├── getTasks()   # ← GET /tarefa
│   ├── createTask() # ← POST /tarefa
│   ├── updateTask() # ← PUT /tarefa/{id}
│   ├── deleteTask() # ← DELETE /tarefa/{id}
│   └── completeTask() # ← PATCH /tarefa/{id}/concluir
└── userService.js   # 👤 Serviços de usuário
    ├── updateProfile() # ← PUT /usuario/{id}
    ├── getCurrentProfile() # ← Dados do localStorage
    └── isLoggedIn()   # ← Verificar autenticação
```
# 📥 Instalação e Configuração<br/><br/>
1. Pré-requisitos<br/>
bash# Verificar versões necessárias<br/>
node --version    # v18.0.0+ requerido<<br/>
npm --version     # v8.0.0+ requerido<br/><br/><br/>
2. Clone e Instalação<br/>
bash# Clonar o repositório<br/>
git clone https://github.com/seu-usuario/task-manager-frontend.git<br/>
cd task-manager-frontend<br/>

 Instalar dependências<br/><br/>
npm install<br/>
 ou<br/>
yarn install<br/><br/>
3. Configuração de Ambiente<br/><br/>
bash# Criar arquivo de ambiente<br/>
cp .env.example .env.local<br/><br/>

# Configurar variáveis (editar .env.local)<br/>
REACT_APP_API_URL=http://localhost:5000/api<br/>
REACT_APP_APP_NAME=Task Manager<br/>
REACT_APP_VERSION=1.0.0<br/><br/>
4. Executar em Desenvolvimento<br/>
bash# Iniciar servidor de desenvolvimento<br/>
npm run dev<br/>
 ou<br/>
yarn dev<br/>

 Aplicação disponível em:<br/>
http://localhost:3000<br/>

# 🏗️ Estrutura do Projeto<br/>
```
frontend/
├── public/                    # 📁 Assets estáticos
│   ├── favicon.ico           # ← Favicon da aplicação
│   ├── logo192.png           # ← Logo para PWA
│   └── manifest.json         # ← Configuração PWA
├── src/                      # 📦 Código fonte
│   ├── components/           # 🧩 Componentes React
│   │   ├── ui/              # 🎨 Componentes base
│   │   │   ├── Button.jsx   # ← Componente de botão
│   │   │   ├── Input.jsx    # ← Componente de input
│   │   │   ├── Modal.jsx    # ← Componente de modal
│   │   │   ├── Loading.jsx  # ← Componente de loading
│   │   │   └── Notification.jsx # ← Sistema de toasts
│   │   ├── layout/          # 🏗️ Componentes de layout
│   │   │   ├── Header.jsx   # ← Cabeçalho da aplicação
│   │   │   ├── Layout.jsx   # ← Wrapper principal
│   │   │   └── ProtectedRoute.jsx # ← Proteção de rotas
│   │   ├── tasks/           # 📋 Componentes de tarefas
│   │   │   ├── TaskList.jsx # ← Lista de tarefas
│   │   │   ├── TaskForm.jsx # ← Formulário de tarefa
│   │   │   ├── TaskCard.jsx # ← Card de tarefa individual
│   │   │   ├── TaskStats.jsx # ← Estatísticas
│   │   │   └── EditProfileModal.jsx # ← Edição de perfil
│   │   ├── reminders/       # 🔔 Sistema de lembretes
│   │   │   ├── ReminderSimple.jsx # ← Componente principal
│   │   │   └── ReminderModal.jsx  # ← Modal de lembrete
│   │   └── auth/            # 🔐 Componentes de auth
│   │       ├── LoginForm.jsx # ← Formulário de login
│   │       └── RegisterForm.jsx # ← Formulário de cadastro
│   ├── hooks/               # 🎣 Custom Hooks
│   │   ├── useAuth.js       # ← Hook de autenticação
│   │   ├── useNotifications.js # ← Hook de notificações
│   │   └── useLocalStorage.js  # ← Hook de localStorage
│   ├── services/            # 🌐 Serviços de API
│   │   ├── api.js           # ← Configuração do Axios
│   │   ├── authService.js   # ← Serviços de auth
│   │   ├── taskService.js   # ← Serviços de tarefas
│   │   └── userService.js   # ← Serviços de usuário
│   ├── utils/               # 🛠️ Utilitários
│   │   ├── helpers.js       # ← Funções auxiliares
│   │   ├── validators.js    # ← Validadores
│   │   ├── formatters.js    # ← Formatadores
│   │   └── constants.js     # ← Constantes
│   ├── styles/              # 🎨 Estilos
│   │   ├── index.css        # ← Estilos globais + Tailwind
│   │   └── components.css   # ← Estilos específicos
│   ├── pages/               # 📄 Páginas da aplicação
│   │   ├── Login.jsx        # ← Página de login
│   │   ├── Register.jsx     # ← Página de cadastro
│   │   ├── Dashboard.jsx    # ← Dashboard principal
│   │   └── NotFound.jsx     # ← Página 404
│   ├── contexts/            # 🏪 React Contexts
│   │   └── AuthContext.jsx  # ← Context de autenticação
│   ├── App.jsx              # ⚛️ Componente raiz
│   ├── App.css              # 🎨 Estilos do App
│   ├── index.js             # 🚀 Entry point
│   └── index.css            # 🎨 Estilos base
├── .env.example             # 🔐 Exemplo de variáveis de ambiente
├── .env.local               # 🔐 Variáveis de ambiente (local)
├── .gitignore               # 📋 Arquivos ignorados pelo Git
├── package.json             # 📦 Dependências e scripts
├── tailwind.config.js       # 🎨 Configuração do Tailwind
├── postcss.config.js        # ⚙️ Configuração do PostCSS
├── vite.config.js           # ⚡ Configuração do Vite
└── README.md                # 📖 Documentação
```
<br/><br/>
# 🎯 Funcionalidades Implementadas<br/>
🔐 Autenticação & Autorização<br/><br/>

✅ Login seguro com validação de campos<br/>
✅ Cadastro de usuários com verificação de email único<br/>
✅ Logout automático quando token expira<br/>
✅ Proteção de rotas - redirecionamento automático<br/>
✅ Persistência de sessão via localStorage<br/>
✅ Recuperação de sessão ao recarregar a página<br/>

📋 Gerenciamento de Tarefas<br/><br/>

✅ CRUD completo - Criar, visualizar, editar, excluir<br/>
✅ Validações robustas - campos obrigatórios, formato de dados<br/>
✅ Estados visuais - pendente, concluída, vencida<<br/>
✅ Prioridades - baixa, média, alta com cores distintas<br/>
✅ Datas de vencimento - controle de prazos<br/>
✅ Contadores dinâmicos - estatísticas em tempo real<br/>

🔍 Busca & Filtros<br/><br/>

✅ Busca em tempo real - por título e descrição<br/>
✅ Filtros por status - todas, pendentes, concluídas<br/>
✅ Filtros por prioridade - todas, alta, média, baixa<br/>
✅ Ordenação - por data, título, prioridade<br/>
✅ Contadores de resultados - feedback visual da busca<br/>
✅ Limpar filtros - reset rápido dos critérios<br/>

🔔 Sistema de Lembretes<br/><br/>

✅ Lembretes opcionais por tarefa<br/>
✅ Notificações em tempo real - modal interativo<br/>
✅ Controle total do usuário - marcar como lido quando quiser<br/>
✅ Indicator visual - sino com badge de contagem<<br/>
✅ Modal informativo - detalhes completos da tarefa<br/>
✅ Ações rápidas - concluir ou reagendar diretamente<br/>

👤 Gestão de Perfil<br/><br/>

✅ Edição completa - nome, email, senha<br/>
✅ Validações de segurança - confirmação de senha obrigatória<br/>
✅ Feedback visual - loading states e mensagens de sucesso/erro<br/>
✅ Atualização em tempo real - reload automático após alterações<br/>
✅ Proteção de dados - validação de email único no backend<br/>
✅ UX intuitiva - modal acessível via clique no avatar<br/>

🎨 Interface & UX<br/><br/>

✅ Design responsivo - mobile-first com Tailwind CSS<br/>
✅ Estados de loading - feedback durante requisições<br/>
✅ Sistema de notificações - toasts para ações do usuário<br/>
✅ Modais interativos - formulários e confirmações<br/>
✅ Indicadores visuais - status da API, contadores, badges<br/>
✅ Acessibilidade - labels apropriados, contrast ratios<br/>

⚡ Performance & Otimização<br/><br/>

✅ Lazy loading - componentes carregados sob demanda<br/>
✅ Memoização - React.memo em componentes pesados<br/>
✅ Debounce - otimização de busca em tempo real<br/>
✅ Code splitting - bundles otimizados<br/>
✅ Cache inteligente - dados persistidos localmente<br/>
✅ Fast refresh - desenvolvimento otimizado com Vite<br/>


<br/><br/>
Desenvolvimento: http://localhost:3000<br/>
Login: http://localhost:3000/login<br/>
Cadastro: http://localhost:3000/register<br/>
Dashboard: http://localhost:3000/dashboard<br/>



