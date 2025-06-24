// checkSetup.js - Sistema completo de verificação

// ===== CONFIGURAÇÕES =====
const ENV_CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME || 'Task Manager',
};

// ===== VERIFICAÇÕES DE AMBIENTE =====
function checkEnvironment() {
  console.log('🔍 Verificando configurações do ambiente...');
  
  const missingVars = [];
  
  if (!ENV_CONFIG.apiUrl) {
    missingVars.push('VITE_API_URL');
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Variáveis de ambiente ausentes:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    return false;
  }
  
  console.log('✅ Variáveis de ambiente OK');
  console.log(`   - API URL: ${ENV_CONFIG.apiUrl}`);
  console.log(`   - App Name: ${ENV_CONFIG.appName}`);
  
  return true;
}

// ===== VERIFICAÇÕES DO NAVEGADOR =====
function checkBrowserFeatures() {
  console.log('\n🔧 Verificando recursos do navegador...');
  
  const features = {
    'Notifications': 'Notification' in window,
    'LocalStorage': 'localStorage' in window,
    'Fetch API': 'fetch' in window,
    'ES6 Modules': 'import' in document.createElement('script'),
  };
  
  const results = [];
  Object.entries(features).forEach(([feature, supported]) => {
    const status = supported ? '✅' : '❌';
    console.log(`   ${status} ${feature}`);
    results.push({ feature, supported });
  });
  
  return results.every(result => result.supported);
}

// ===== VERIFICAÇÃO DA API =====
async function checkApiConnection() {
  try {
    console.log('\n🌐 Testando conexão com a API...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${ENV_CONFIG.apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const healthData = await response.json();
      console.log('✅ API está respondendo');
      console.log(`   - Status: ${healthData.status || 'healthy'}`);
      console.log(`   - Serviço: ${healthData.service || 'API'}`);
      console.log(`   - URL: ${ENV_CONFIG.apiUrl}/health`);
      return true;
    } else {
      console.log('⚠️ API respondeu mas com erro');
      console.log(`   - Status HTTP: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('❌ Timeout: API não respondeu em 5 segundos');
    } else {
      console.log('❌ Erro ao conectar com a API:');
      console.log(`   - ${error.message}`);
    }
    
    console.log('\n💡 Verifique se:');
    console.log('   1. A API .NET está rodando (dotnet run)');
    console.log('   2. A URL está correta no .env');
    console.log('   3. CORS está configurado na API');
    console.log('   4. Endpoint /api/health existe na API');
    
    return false;
  }
}

// ===== VERIFICAÇÃO ROBUSTA COM RETRY =====
async function checkApiConnectionRobust() {
  const maxRetries = 3;
  const timeout = 5000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🌐 Testando API (tentativa ${attempt}/${maxRetries})...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${ENV_CONFIG.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('✅ API está saudável');
        console.log(`   - Status: ${healthData.status || 'healthy'}`);
        console.log(`   - Timestamp: ${healthData.timestamp || 'N/A'}`);
        return true;
      } else {
        console.log(`⚠️ API não saudável (HTTP ${response.status})`);
        if (attempt < maxRetries) {
          console.log('   - Tentando novamente em 2s...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`❌ Timeout na tentativa ${attempt} (${timeout}ms)`);
      } else {
        console.log(`❌ Erro na tentativa ${attempt}: ${error.message}`);
      }
      
      if (attempt < maxRetries) {
        console.log('   - Tentando novamente em 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.log('\n💡 Todas as tentativas falharam. Verifique se:');
  console.log('   1. A API .NET está rodando (dotnet run)');
  console.log('   2. A URL está correta no .env');
  console.log('   3. CORS está configurado na API');
  console.log('   4. Endpoint /api/health existe na API');
  
  return false;
}

// ===== INFORMAÇÕES ÚTEIS =====
function displayApiEndpoints() {
  console.log('\n📋 Endpoints da API disponíveis:');
  console.log('   🔐 Autenticação:');
  console.log('      POST /auth/login');
  console.log('      POST /usuario/registrar');
  console.log('   📝 Tarefas:');
  console.log('      GET    /tarefa');
  console.log('      POST   /tarefa');
  console.log('      GET    /tarefa/{id}');
  console.log('      PUT    /tarefa/{id}');
  console.log('      DELETE /tarefa/{id}');
  console.log('      PATCH  /tarefa/{id}/concluir');
  console.log('      GET    /tarefa/pendentes');
  console.log('      GET    /tarefa/concluidas');
  console.log('      GET    /tarefa/prioridade/{prioridade}');
  console.log('   🏥 Health Check:');
  console.log('      GET    /health');
}

// ===== FUNÇÃO PRINCIPAL =====
async function runSetupCheck(useRobustCheck = false) {
  console.log('🚀 VERIFICAÇÃO DE CONFIGURAÇÃO - TASK MANAGER');
  console.log('==================================================');
  
  // 1. Verificar ambiente
  const envOk = checkEnvironment();
  
  // 2. Verificar navegador
  const browserOk = checkBrowserFeatures();
  
  // 3. Verificar API (usando a versão escolhida)
  const apiOk = useRobustCheck 
    ? await checkApiConnectionRobust() 
    : await checkApiConnection();
  
  // 4. Mostrar endpoints úteis
  displayApiEndpoints();
  
  // 5. Resumo final
  console.log('\n==================================================');
  console.log('📊 RESUMO:');
  console.log(`   Ambiente: ${envOk ? '✅' : '❌'}`);
  console.log(`   Navegador: ${browserOk ? '✅' : '❌'}`);
  console.log(`   API: ${apiOk ? '✅' : '❌'}`);
  
  const allOk = envOk && browserOk && apiOk;
  
  if (allOk) {
    console.log('\n🎉 Tudo configurado! Sistema pronto para uso.');
  } else {
    console.log('\n⚠️ Algumas configurações precisam ser ajustadas.');
    console.log('   Verifique os erros acima e tente novamente.');
  }
  
  return {
    environment: envOk,
    browser: browserOk,
    api: apiOk,
    overall: allOk
  };
}

// ===== EXPORTAR FUNÇÕES PARA USO =====
export {
  checkEnvironment,
  checkBrowserFeatures,
  checkApiConnection,
  checkApiConnectionRobust,
  runSetupCheck,
  displayApiEndpoints
};

// ===== AUTO-EXECUÇÃO EM DESENVOLVIMENTO =====
if (import.meta.env.DEV) {
  // Executa automaticamente no modo desenvolvimento
  setTimeout(() => {
    runSetupCheck(true); // Usa versão robusta em DEV
  }, 1000);
}