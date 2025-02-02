document.addEventListener('DOMContentLoaded', () => {
  let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
  let currentUser = null;
  let editingId = null;
  let editingType = null;

  // Função para salvar dados no localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados!');
    }
  };

  // Exibe apenas a seção (tela) selecionada
  window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) sectionToShow.classList.remove('hidden');
  };

  // Menu lateral: minimizar/maximizar
  document.getElementById('toggle-fullscreen').addEventListener('click', () => {
    const menu = document.getElementById('menu-lateral');
    menu.classList.toggle('w-64');
    menu.classList.toggle('w-16');
    document.getElementById('maximize-icon').classList.toggle('hidden');
    document.getElementById('minimize-icon').classList.toggle('hidden');
  });

  // Alterna entre telas de login e cadastro de usuário
  const setupScreenToggle = (from, to) => {
    document.getElementById(from).addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-screen').classList.toggle('hidden');
      document.getElementById('register-screen').classList.toggle('hidden');
    });
  };
  setupScreenToggle('show-register', 'login-screen');
  setupScreenToggle('show-login', 'register-screen');

  // Cadastro de novo usuário
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

  // Login (o usuário usará somente os seus dados)
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
      document.getElementById('user-greeting').textContent = `Olá, ${currentUser.nome}`;
      showSection('cadastro-pacientes');
      updateAllTables();
    } else {
      alert('Credenciais inválidas!');
    }
  });

  // Atualiza as tabelas de visualização conforme os dados do usuário
  const updateAllTables = () => {
    if (!currentUser) return;
    updateTable('pacientes', currentUser.dbPacientes.pacientes);
    updateTable('profissionais', currentUser.dbCadastro.especialistas);
    updateTable('consultas-gerais', currentUser.dbConsultas.consultas);
  };

  // Função genérica para atualizar uma tabela
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

  // Mapeamento para as funções de edição e exclusão
  const mapping = {
    'pacientes': {
      storageKey: 'dbPacientes',
      arrKey: 'pacientes',
      formId: 'form-paciente',
      prefix: 'paciente-'
    },
    'profissionais': {
      storageKey: 'dbCadastro',
      arrKey: 'especialistas',
      formId: 'form-especialista',
      prefix: 'especialista-'
    },
    'consultas-gerais': {
      storageKey: 'dbConsultas',
      arrKey: 'consultas',
      formId: 'form-consulta',
      prefix: 'consulta-'
    }
  };

  // Função para editar um item
  window.editItem = (type, index) => {
    const config = mapping[type];
    if (!config) return;
    const collection = currentUser[config.storageKey][config.arrKey];
    const item = collection[index];
    const form = document.getElementById(config.formId);
    // Preenche o formulário com os dados do item para edição
    for (let key in item) {
      const field = form.querySelector(`#${config.prefix}${key}`);
      if (field) field.value = item[key];
    }
    // Armazena as informações de qual item está sendo editado
    editingId = index;
    editingType = type;
  };

  // Função para excluir um item
  window.deleteItem = (type, index) => {
    if (!confirm('Confirmar exclusão?')) return;
    const config = mapping[type];
    if (!config) return;
    currentUser[config.storageKey][config.arrKey].splice(index, 1);
    saveData('db_usuarios', dbUsuarios);
    updateAllTables();
  };

  /* Cadastro de cada tipo por meio de manipuladores dedicados */

  // Cadastro de Paciente (dados vão para currentUser.dbPacientes.pacientes)
  document.getElementById('form-paciente').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      nome: document.getElementById('paciente-nome').value,
      cpf: document.getElementById('paciente-cpf').value,
      idade: document.getElementById('paciente-idade').value,
      responsavel: document.getElementById('paciente-responsavel').value,
      telefone: document.getElementById('paciente-telefone').value,
      email: document.getElementById('paciente-email').value,
      ultimaConsulta: document.getElementById('paciente-ultima-consulta').value
    };

    // Se estamos editando, atualiza o item; caso contrário, insere um novo
    if (editingType === 'pacientes' && editingId !== null) {
      currentUser.dbPacientes.pacientes[editingId] = formData;
      editingId = null;
      editingType = null;
    } else {
      currentUser.dbPacientes.pacientes.push(formData);
    }
    saveData('db_usuarios', dbUsuarios);
    updateAllTables();
    e.target.reset();
  });

  // Cadastro de Especialista (dados vão para currentUser.dbCadastro.especialistas)
  document.getElementById('form-especialista').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      nome: document.getElementById('nome-especialista').value,
      cpf: document.getElementById('cpf-especialista').value,
      // Observe que o campo de especialidade foi renomeado para seguir a convenção ("especialista-especialidade")
      especialidade: document.getElementById('especialista-especialidade').value,
      turno: document.getElementById('turno-especialista').value,
      telefone: document.getElementById('telefone-especialista').value,
      email: document.getElementById('email-especialista').value
    };

    if (editingType === 'profissionais' && editingId !== null) {
      currentUser.dbCadastro.especialistas[editingId] = formData;
      editingId = null;
      editingType = null;
    } else {
      currentUser.dbCadastro.especialistas.push(formData);
    }
    saveData('db_usuarios', dbUsuarios);
    updateAllTables();
    e.target.reset();
  });

  // Cadastro de Consulta (dados vão para currentUser.dbConsultas.consultas)
  document.getElementById('form-consulta').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      data: document.getElementById('data-consulta').value,
      horario: document.getElementById('horario-consulta').value,
      nomePaciente: document.getElementById('nome-paciente-consulta').value,
      idade: document.getElementById('idade-paciente-consulta').value,
      responsavel: document.getElementById('responsavel-consulta').value,
      telefone: document.getElementById('telefone-consulta').value,
      especialidade: document.getElementById('especialidade-consulta').value,
      consultorio: document.getElementById('consultorio-consulta').value,
      especialista: document.getElementById('especialista-consulta').value
    };

    if (editingType === 'consultas-gerais' && editingId !== null) {
      currentUser.dbConsultas.consultas[editingId] = formData;
      editingId = null;
      editingType = null;
    } else {
      currentUser.dbConsultas.consultas.push(formData);
    }
    saveData('db_usuarios', dbUsuarios);
    updateAllTables();
    e.target.reset();
  });

  // Registro do Service Worker para uso offline (se disponível)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registrado:', reg))
      .catch(err => console.error('SW erro:', err));
  }
});
