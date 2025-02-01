document.addEventListener('DOMContentLoaded', () => {
  // Carregar dados do localStorage
  let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
  let dbPacientes = JSON.parse(localStorage.getItem('db_pacientes')) || { pacientes: [] };
  let dbConsultas = JSON.parse(localStorage.getItem('db_consultas')) || { consultas: [] };
  let dbCadastro = JSON.parse(localStorage.getItem('db_cadastro')) || { especialistas: [] };

  let editingId = null; // Variável global para edição

  // Salvar dados no localStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Exibir uma seção específica
  window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
  };

  // Alternar menu lateral
  document.getElementById('toggle-fullscreen').addEventListener('click', () => {
    const menuLateral = document.getElementById('menu-lateral');
    menuLateral.classList.toggle('w-64');
    menuLateral.classList.toggle('w-16');
  });

  // Alternar entre login e cadastro
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

  // **Cadastro de Usuário permitindo múltiplos nomes para o mesmo e-mail**
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;

    if (nome && email && senha) {
      dbUsuarios.push({ nome, email, senha });
      saveData('db_usuarios', dbUsuarios);

      alert('Cadastro realizado com sucesso!');
      document.getElementById('register-screen').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
    } else {
      alert('Preencha todos os campos!');
    }
  });

  // **Login do Usuário e Liberação de Acesso**
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('login-name').value;
    const senha = document.getElementById('login-password').value;

    const usuario = dbUsuarios.find(u => u.nome === nome && u.senha === senha);

    if (usuario) {
      alert(`Bem-vindo, ${usuario.nome}!`);
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('main-container').classList.remove('hidden');
      showSection('cadastro-pacientes');
    } else {
      alert('Nome ou senha incorretos!');
    }
  });

  // **Atualização das tabelas**
  const updateTables = () => {
    updatePacientesTable();
    updateConsultasTable();
    updateProfissionaisTable();
  };

  // **Tabelas de Pacientes**
  const updatePacientesTable = () => {
    const tabela = document.getElementById('tabela-pacientes').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    dbPacientes.pacientes.forEach(paciente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${paciente.cpf}</td>
        <td>${paciente.idade}</td>
        <td>${paciente.telefone}</td>
        <td>${paciente.email}</td>
      `;
      tabela.appendChild(row);
    });
  };

  // **Tabela de Consultas**
  const updateConsultasTable = () => {
    const tabela = document.getElementById('tabela-consultas-gerais').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    dbConsultas.consultas.forEach(consulta => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${consulta.data}</td>
        <td>${consulta.horario}</td>
        <td>${consulta.paciente}</td>
        <td>${consulta.especialidade}</td>
        <td>${consulta.especialista}</td>
      `;
      tabela.appendChild(row);
    });
  };

  // **Tabela de Profissionais**
  const updateProfissionaisTable = () => {
    const tabela = document.getElementById('tabela-profissionais').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    dbCadastro.especialistas.forEach(especialista => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${especialista.nome}</td>
        <td>${especialista.cpf}</td>
        <td>${especialista.especialidade}</td>
        <td>${especialista.turno}</td>
        <td>${especialista.telefone}</td>
      `;
      tabela.appendChild(row);
    });
  };

  // **Registro de Service Worker**
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('Erro no Service Worker:', error);
      });
  }

  // **Inicialização**
  updateTables();
});