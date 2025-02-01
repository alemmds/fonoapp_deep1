document.addEventListener('DOMContentLoaded', () => {
  let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
  let currentUser = null; // Armazena o usuário logado
  let editingId = null; // Variável global para edição

  // Função para salvar dados no localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
    }
  };

  // Função para mostrar uma seção
  window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
  };

  // Alternar o menu lateral
  document.getElementById('toggle-fullscreen').addEventListener('click', () => {
    const menuLateral = document.getElementById('menu-lateral');
    const maximizeIcon = document.getElementById('maximize-icon');
    const minimizeIcon = document.getElementById('minimize-icon');
    menuLateral.classList.toggle('w-64');
    menuLateral.classList.toggle('w-16');
    maximizeIcon.classList.toggle('hidden');
    minimizeIcon.classList.toggle('hidden');
  });

  // Alternar entre telas de login e cadastro
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('register-screen').classList.remove('hidden');
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
  });

  // Cadastro de Usuário
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;

    if (nome && email && senha) {
      const usuarioExistente = dbUsuarios.find(u => u.email === email);
      if (usuarioExistente) {
        alert('Este e-mail já está cadastrado!');
        return;
      }

      const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senha,
        dbPacientes: { pacientes: [] },
        dbCadastro: { especialistas: [] },
        dbConsultas: { consultas: [] }
      };

      dbUsuarios.push(novoUsuario);
      saveData('db_usuarios', dbUsuarios);
      alert('Cadastro realizado com sucesso!');
      document.getElementById('register-screen').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
    } else {
      alert('Preencha todos os campos!');
    }
  });

  // Login do Usuário
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('login-name').value;
    const senha = document.getElementById('login-password').value;
    const usuario = dbUsuarios.find(u => u.nome === nome && u.senha === senha);

    if (usuario) {
      currentUser = usuario;
      alert(`Bem-vindo, ${usuario.nome}!`);
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('main-container').classList.remove('hidden');
      showSection('cadastro-pacientes'); // Exibe a seção padrão após o login
      updateTables(); // Atualiza as tabelas com os dados do usuário
    } else {
      alert('Nome ou senha incorretos!');
    }
  });

  // Atualização das tabelas
  const updateTables = () => {
    if (!currentUser) return;

    updatePacientesTable();
    updateConsultasTable();
    updateProfissionaisTable();
  };

  // Tabelas de Pacientes
  const updatePacientesTable = () => {
    const tabela = document.getElementById('tabela-pacientes').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    currentUser.dbPacientes.pacientes.forEach((paciente, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${paciente.cpf}</td>
        <td>${paciente.idade}</td>
        <td>${paciente.responsavel}</td>
        <td>${paciente.telefone}</td>
        <td>${paciente.email}</td>
        <td>${paciente.ultimaConsulta}</td>
        <td>
          <button onclick="editPaciente(${index})">Editar</button>
          <button onclick="deletePaciente(${index})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  };

  // Funções para editar/excluir pacientes
  window.deletePaciente = (index) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      currentUser.dbPacientes.pacientes.splice(index, 1);
      saveData('db_usuarios', dbUsuarios);
      updatePacientesTable();
    }
  };

  window.editPaciente = (index) => {
    const paciente = currentUser.dbPacientes.pacientes[index];
    document.getElementById('paciente-nome').value = paciente.nome;
    document.getElementById('paciente-cpf').value = paciente.cpf;
    document.getElementById('paciente-idade').value = paciente.idade;
    document.getElementById('paciente-responsavel').value = paciente.responsavel;
    document.getElementById('paciente-telefone').value = paciente.telefone;
    document.getElementById('paciente-email').value = paciente.email;
    document.getElementById('paciente-ultima-consulta').value = paciente.ultimaConsulta;
    editingId = index;
  };

  // Formulário de Cadastro de Pacientes
  document.getElementById('form-paciente').addEventListener('submit', (e) => {
    e.preventDefault();
    const paciente = {
      nome: document.getElementById('paciente-nome').value,
      cpf: document.getElementById('paciente-cpf').value,
      idade: document.getElementById('paciente-idade').value,
      responsavel: document.getElementById('paciente-responsavel').value,
      telefone: document.getElementById('paciente-telefone').value,
      email: document.getElementById('paciente-email').value,
      ultimaConsulta: document.getElementById('paciente-ultima-consulta').value
    };

    if (editingId !== null) {
      // Editar paciente existente
      currentUser.dbPacientes.pacientes[editingId] = paciente;
      editingId = null;
    } else {
      // Adicionar novo paciente
      currentUser.dbPacientes.pacientes.push(paciente);
    }

    saveData('db_usuarios', dbUsuarios);
    updatePacientesTable();
    document.getElementById('form-paciente').reset();
  });

  // Tabelas de Consultas
  const updateConsultasTable = () => {
    const tabela = document.getElementById('tabela-consultas-gerais').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    currentUser.dbConsultas.consultas.forEach((consulta, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${consulta.data}</td>
        <td>${consulta.horario}</td>
        <td>${consulta.paciente}</td>
        <td>${consulta.idade}</td>
        <td>${consulta.responsavel}</td>
        <td>${consulta.telefone}</td>
        <td>${consulta.especialidade}</td>
        <td>${consulta.consultorio}</td>
        <td>${consulta.especialista}</td>
        <td>
          <button onclick="editConsulta(${index})">Editar</button>
          <button onclick="deleteConsulta(${index})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  };

  // Tabelas de Profissionais
  const updateProfissionaisTable = () => {
    const tabela = document.getElementById('tabela-profissionais').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    currentUser.dbCadastro.especialistas.forEach((especialista, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${especialista.nome}</td>
        <td>${especialista.cpf}</td>
        <td>${especialista.especialidade}</td>
        <td>${especialista.turno}</td>
        <td>${especialista.telefone}</td>
        <td>${especialista.email}</td>
        <td>
          <button onclick="editProfissional(${index})">Editar</button>
          <button onclick="deleteProfissional(${index})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  };

  // Registro de Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('Erro no Service Worker:', error);
      });
  }

  // Inicialização
  updateTables();
});
