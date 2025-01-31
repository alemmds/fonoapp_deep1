document.addEventListener('DOMContentLoaded', () => {
  // Carrega os dados do localStorage
  let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
  let dbCadastro = JSON.parse(localStorage.getItem('db_cadastro')) || { especialistas: [], consultorios: [] };
  let dbPacientes = JSON.parse(localStorage.getItem('db_pacientes')) || { pacientes: [] };
  let dbConsultas = JSON.parse(localStorage.getItem('db_consultas')) || { consultas: [] };

  // Variável global para armazenar o ID em edição
  let editingId = null;

  // Função para salvar dados no localStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Função para mostrar uma seção
  window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
  };

  // Função para alternar o menu lateral
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

  // Cadastro de usuário
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;

    if (nome && email && senha) {
      // Verifica se o usuário já existe
      const usuarioExistente = dbUsuarios.find(u => u.email === email);
      if (usuarioExistente) {
        alert('Email já cadastrado!');
        return;
      }

      // Adiciona o novo usuário
      dbUsuarios.push({ nome, email, senha });
      saveData('db_usuarios', dbUsuarios);

      alert('Cadastro realizado com sucesso!');
      document.getElementById('register-screen').classList.add('hidden');
      document.getElementById('main-container').classList.remove('hidden');
    } else {
      alert('Preencha todos os campos!');
    }
  });

  // Login do usuário
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('login-name').value;
    const senha = document.getElementById('login-password').value;

    // Verifica se o usuário existe e a senha está correta
    const usuario = dbUsuarios.find(u => u.nome === nome && u.senha === senha);
    if (usuario) {
      alert('Login realizado com sucesso!');
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('main-container').classList.remove('hidden');
    } else {
      alert('Nome ou senha incorretos!');
    }
  });

  // Função para adicionar/atualizar um paciente
  document.getElementById('form-paciente').addEventListener('submit', (e) => {
    e.preventDefault();
    const paciente = {
      id: editingId || Date.now(), // Usa o ID em edição ou gera um novo
      nome: document.getElementById('nome-paciente').value,
      cpf: document.getElementById('cpf-paciente').value,
      idade: document.getElementById('idade-paciente').value,
      responsavel: document.getElementById('responsavel-paciente').value,
      telefone: document.getElementById('telefone-paciente').value,
      email: document.getElementById('email-paciente').value,
      ultimaConsulta: document.getElementById('ultima-consulta').value
    };

    if (editingId) {
      // Atualiza o paciente existente
      const index = dbPacientes.pacientes.findIndex(p => p.id === editingId);
      dbPacientes.pacientes[index] = paciente;
      editingId = null; // Reseta o ID em edição
    } else {
      // Adiciona um novo paciente
      dbPacientes.pacientes.push(paciente);
    }

    saveData('db_pacientes', dbPacientes);
    document.getElementById('form-paciente').reset();
    updatePacientesTable();
  });

  // Função para editar um paciente
  window.editarPaciente = (id) => {
    const paciente = dbPacientes.pacientes.find(p => p.id === id);
    if (paciente) {
      document.getElementById('nome-paciente').value = paciente.nome;
      document.getElementById('cpf-paciente').value = paciente.cpf;
      document.getElementById('idade-paciente').value = paciente.idade;
      document.getElementById('responsavel-paciente').value = paciente.responsavel;
      document.getElementById('telefone-paciente').value = paciente.telefone;
      document.getElementById('email-paciente').value = paciente.email;
      document.getElementById('ultima-consulta').value = paciente.ultimaConsulta;

      // Armazena o ID do paciente em edição
      editingId = paciente.id;

      // Mostra a seção de cadastro de pacientes
      showSection('cadastro-pacientes');
    }
  };

  // Função para excluir um paciente
  window.excluirPaciente = (id) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      dbPacientes.pacientes = dbPacientes.pacientes.filter(p => p.id !== id);
      saveData('db_pacientes', dbPacientes);
      updatePacientesTable();
    }
  };

  // Função para atualizar a tabela de pacientes
  const updatePacientesTable = () => {
    const tabelaPacientes = document.getElementById('tabela-pacientes').getElementsByTagName('tbody')[0];
    tabelaPacientes.innerHTML = '';
    dbPacientes.pacientes.forEach(paciente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${paciente.nome}</td>
        <td class="p-2">${paciente.cpf}</td>
        <td class="p-2">${paciente.idade}</td>
        <td class="p-2">${paciente.responsavel}</td>
        <td class="p-2">${paciente.telefone}</td>
        <td class="p-2">${paciente.email}</td>
        <td class="p-2">${paciente.ultimaConsulta}</td>
        <td class="p-2 flex space-x-2">
          <button onclick="editarPaciente(${paciente.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirPaciente(${paciente.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tabelaPacientes.appendChild(row);
    });
  };

  // Função para adicionar/atualizar um especialista
  document.getElementById('form-especialista').addEventListener('submit', (e) => {
    e.preventDefault();
    const especialista = {
      id: editingId || Date.now(), // Usa o ID em edição ou gera um novo
      nome: document.getElementById('nome-especialista').value,
      cpf: document.getElementById('cpf-especialista').value,
      especialidade: document.getElementById('especialidade').value,
      turno: document.getElementById('turno-especialista').value,
      telefone: document.getElementById('telefone-especialista').value,
      email: document.getElementById('email-especialista').value
    };

    if (editingId) {
      // Atualiza o especialista existente
      const index = dbCadastro.especialistas.findIndex(e => e.id === editingId);
      dbCadastro.especialistas[index] = especialista;
      editingId = null; // Reseta o ID em edição
    } else {
      // Adiciona um novo especialista
      dbCadastro.especialistas.push(especialista);
    }

    saveData('db_cadastro', dbCadastro);
    document.getElementById('form-especialista').reset();
    updateProfissionaisTable();
  });

  // Função para editar um especialista
  window.editarEspecialista = (id) => {
    const especialista = dbCadastro.especialistas.find(e => e.id === id);
    if (especialista) {
      document.getElementById('nome-especialista').value = especialista.nome;
      document.getElementById('cpf-especialista').value = especialista.cpf;
      document.getElementById('especialidade').value = especialista.especialidade;
      document.getElementById('turno-especialista').value = especialista.turno;
      document.getElementById('telefone-especialista').value = especialista.telefone;
      document.getElementById('email-especialista').value = especialista.email;

      // Armazena o ID do especialista em edição
      editingId = especialista.id;

      // Mostra a seção de cadastro de especialistas
      showSection('cadastro-especialistas');
    }
  };

  // Função para excluir um especialista
  window.excluirEspecialista = (id) => {
    if (confirm('Tem certeza que deseja excluir este especialista?')) {
      dbCadastro.especialistas = dbCadastro.especialistas.filter(e => e.id !== id);
      saveData('db_cadastro', dbCadastro);
      updateProfissionaisTable();
    }
  };

  // Função para atualizar a tabela de profissionais
  const updateProfissionaisTable = () => {
    const tabelaProfissionais = document.getElementById('tabela-profissionais').getElementsByTagName('tbody')[0];
    tabelaProfissionais.innerHTML = '';
    dbCadastro.especialistas.forEach(especialista => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${especialista.nome}</td>
        <td class="p-2">${especialista.cpf}</td>
        <td class="p-2">${especialista.especialidade}</td>
        <td class="p-2">${especialista.turno}</td>
        <td class="p-2">${especialista.telefone}</td>
        <td class="p-2">${especialista.email}</td>
        <td class="p-2 flex space-x-2">
          <button onclick="editarEspecialista(${especialista.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirEspecialista(${especialista.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tabelaProfissionais.appendChild(row);
    });
  };

  // Função para validar horário ocupado
  const isHorarioOcupado = (data, horario, especialista) => {
    return dbConsultas.consultas.some(
      (consulta) =>
        consulta.data === data &&
        consulta.horario === horario &&
        consulta.especialista === especialista
    );
  };

  // Função para validar paciente cadastrado
  const isPacienteCadastrado = (nomePaciente) => {
    return dbPacientes.pacientes.some((paciente) => paciente.nome === nomePaciente);
  };

  // Função para adicionar/atualizar uma consulta
  document.getElementById('form-consulta').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = document.getElementById('data-consulta').value;
    const horario = document.getElementById('horario-consulta').value;
    const especialista = document.getElementById('especialista-consulta').value;
    const nomePaciente = document.getElementById('nome-paciente-consulta').value;

    // Validação de horário ocupado
    if (isHorarioOcupado(data, horario, especialista)) {
      alert('Horário já ocupado para este especialista!');
      return;
    }

    // Validação de paciente cadastrado
    if (!isPacienteCadastrado(nomePaciente)) {
      alert('Necessário cadastrar o paciente!');
      return;
    }

    const consulta = {
      id: editingId || Date.now(), // Usa o ID em edição ou gera um novo
      data: data,
      horario: horario,
      paciente: nomePaciente,
      idade: document.getElementById('idade-paciente-consulta').value,
      responsavel: document.getElementById('responsavel-consulta').value,
      telefone: document.getElementById('telefone-consulta').value,
      especialidade: document.getElementById('especialidade-consulta').value,
      consultorio: document.getElementById('consultorio-consulta').value,
      especialista: especialista
    };

    if (editingId) {
      // Atualiza a consulta existente
      const index = dbConsultas.consultas.findIndex(c => c.id === editingId);
      dbConsultas.consultas[index] = consulta;
      editingId = null; // Reseta o ID em edição
    } else {
      // Adiciona uma nova consulta
      dbConsultas.consultas.push(consulta);
    }

    saveData('db_consultas', dbConsultas);
    document.getElementById('form-consulta').reset();
    updateConsultasTables();
  });

  // Função para editar uma consulta
  window.editarConsulta = (id) => {
    const consulta = dbConsultas.consultas.find(c => c.id === id);
    if (consulta) {
      document.getElementById('data-consulta').value = consulta.data;
      document.getElementById('horario-consulta').value = consulta.horario;
      document.getElementById('nome-paciente-consulta').value = consulta.paciente;
      document.getElementById('idade-paciente-consulta').value = consulta.idade;
      document.getElementById('responsavel-consulta').value = consulta.responsavel;
      document.getElementById('telefone-consulta').value = consulta.telefone;
      document.getElementById('especialidade-consulta').value = consulta.especialidade;
      document.getElementById('consultorio-consulta').value = consulta.consultorio;
      document.getElementById('especialista-consulta').value = consulta.especialista;

      // Armazena o ID da consulta em edição
      editingId = consulta.id;

      // Mostra a seção de cadastro de consultas
      showSection('cadastro-consultas');
    }
  };

  // Função para excluir uma consulta
  window.excluirConsulta = (id) => {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      dbConsultas.consultas = dbConsultas.consultas.filter(c => c.id !== id);
      saveData('db_consultas', dbConsultas);
      updateConsultasTables();
    }
  };

  // Função para atualizar as tabelas de consultas
  const updateConsultasTables = () => {
    const tabelaConsultasGerais = document.getElementById('tabela-consultas-gerais').getElementsByTagName('tbody')[0];
    const tabelaConsultasDia = document.getElementById('tabela-consultas-dia').getElementsByTagName('tbody')[0];
    const hoje = new Date().toISOString().split('T')[0];

    tabelaConsultasGerais.innerHTML = '';
    tabelaConsultasDia.innerHTML = '';

    dbConsultas.consultas.forEach(consulta => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${consulta.data}</td>
        <td class="p-2">${consulta.horario}</td>
        <td class="p-2">${consulta.paciente}</td>
        <td class="p-2">${consulta.idade}</td>
        <td class="p-2">${consulta.responsavel}</td>
        <td class="p-2">${consulta.telefone}</td>
        <td class="p-2">${consulta.especialidade}</td>
        <td class="p-2">${consulta.consultorio}</td>
        <td class="p-2">${consulta.especialista}</td>
        <td class="p-2 flex space-x-2">
          <button onclick="editarConsulta(${consulta.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirConsulta(${consulta.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tabelaConsultasGerais.appendChild(row);

      if (consulta.data === hoje) {
        const rowDia = row.cloneNode(true);
        tabelaConsultasDia.appendChild(rowDia);
      }
    });
  };

  // Inicialização
  showSection('cadastro-pacientes'); // Mostra a seção de cadastro de pacientes por padrão
  updatePacientesTable(); // Atualiza a tabela de pacientes
  updateConsultasTables(); // Atualiza as tabelas de consultas
  updateProfissionaisTable(); // Atualiza a tabela de profissionais

  // Registra o Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
    });
  }
});
