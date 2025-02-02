document.addEventListener('DOMContentLoaded', () => {
  let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
  let currentUser = null;
  let editingId = null;

  // Função para salvar dados
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados!');
    }
  };

  // Função para mostrar seções
  window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) sectionToShow.classList.remove('hidden');
  };

  // Menu lateral
  document.getElementById('toggle-fullscreen').addEventListener('click', () => {
    const menu = document.getElementById('menu-lateral');
    const icons = ['maximize-icon', 'minimize-icon'];
    menu.classList.toggle('w-64');
    menu.classList.toggle('w-16');
    icons.forEach(id => document.getElementById(id).classList.toggle('hidden'));
  });

  // Navegação entre telas
  const setupScreenToggle = (from, to) => {
    document.getElementById(from).addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-screen').classList.toggle('hidden');
      document.getElementById('register-screen').classList.toggle('hidden');
    });
  };
  setupScreenToggle('show-register', 'login-screen');
  setupScreenToggle('show-login', 'register-screen');

  // Mensagem de boas-vindas na tela de login
  const welcomeMessage = document.createElement('p');
  welcomeMessage.textContent = 'Bem-vindo à FONOCLINI! Por favor, faça login para continuar.';
  document.getElementById('login-screen').prepend(welcomeMessage);

  // Centralizar título e formulários
  const centerElements = () => {
    const elementsToCenter = document.querySelectorAll('.centered');
    elementsToCenter.forEach(element => {
      element.style.display = 'flex';
      element.style.flexDirection = 'column';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
    });
  };
  centerElements();

  // Cadastro de usuário
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      nome: document.getElementById('register-name').value,
      email: document.getElementById('register-email').value,
      senha: document.getElementById('register-password').value
    };

    if (dbUsuarios.some(u => u.email === formData.email)) {
      alert('E-mail já cadastrado!');
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now(),
      dbPacientes: { pacientes: [] },
      dbCadastro: { especialistas: [] },
      dbConsultas: { consultas: [] }
    };

    dbUsuarios.push(newUser);
    saveData('db_usuarios', dbUsuarios);
    alert('Cadastro realizado!');
    document.getElementById('register-form').reset();
    document.getElementById('show-login').click();
  });

  // Login
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const credentials = {
      nome: document.getElementById('login-name').value,
      senha: document.getElementById('login-password').value
    };

    const user = dbUsuarios.find(u => 
      u.nome === credentials.nome && 
      u.senha === credentials.senha
    );

    if (user) {
      currentUser = user;
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('main-container').classList.remove('hidden');
      showSection('cadastro-pacientes');
      updateAllTables();
      // Mostrar nome do usuário no menu
      document.getElementById('user-greeting').textContent = `Olá, ${currentUser.nome}`;
    } else {
      alert('Credenciais inválidas!');
    }
  });

  // Atualização de tabelas
  const updateAllTables = () => {
    if (!currentUser) return;
    updateTable('pacientes', currentUser.dbPacientes.pacientes);
    updateTable('consultas-gerais', currentUser.dbConsultas.consultas);
    updateTable('profissionais', currentUser.dbCadastro.especialistas);
  };

  // Função genérica para atualizar tabelas
  const updateTable = (tableId, data) => {
    const table = document.getElementById(`tabela-${tableId}`).querySelector('tbody');
    table.innerHTML = data.map((item, index) => `
      <tr>
        ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
        <td>
          <button onclick="editItem('${tableId}', ${index})">Editar</button>
          <button onclick="deleteItem('${tableId}', ${index})">Excluir</button>
        </td>
      </tr>
    `).join('');
  };

  // Funções genéricas para editar/excluir
  window.editItem = (type, index) => {
    const collection = currentUser[`db${type.charAt(0).toUpperCase() + type.slice(1)}`][type];
    const item = collection[index];
    const form = document.getElementById(`form-${type}`);
    
    Object.keys(item).forEach(key => {
      const field = form.querySelector(`#${type}-${key}`);
      if (field) field.value = item[key];
    });
    
    editingId = index;
  };

  window.deleteItem = (type, index) => {
    if (!confirm('Confirmar exclusão?')) return;
    currentUser[`db${type.charAt(0).toUpperCase() + type.slice(1)}`][type].splice(index, 1);
    saveData('db_usuarios', dbUsuarios);
    updateAllTables();
  };

  // Manipulação de formulários
  const setupForm = (formId, dataType) => {
    document.getElementById(formId).addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {};
      Array.from(e.target.elements).forEach(element => {
        if (element.id.startsWith(dataType)) {
          const key = element.id.replace(`${dataType}-`, '');
          formData[key] = element.value;
        }
      });

      const collection = currentUser[`db${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`][dataType];
      
      if (editingId !== null) {
        collection[editingId] = formData;
        editingId = null;
      } else {
        collection.push(formData);
      }

      saveData('db_usuarios', dbUsuarios);
      updateAllTables();
      e.target.reset();
    });
  };

  // Configurar todos os formulários
  setupForm('form-paciente', 'paciente');
  setupForm('form-especialista', 'especialista');
  setupForm('form-consulta', 'consulta');

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registrado:', reg))
      .catch(err => console.error('SW erro:', err));
  }
});
