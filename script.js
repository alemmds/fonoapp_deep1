document.addEventListener('DOMContentLoaded', () => {
  // Mapeamento das seções
  const sections = {
    'cadastro-pacientes': document.getElementById('cadastro-pacientes'),
    'cadastro-especialistas': document.getElementById('cadastro-especialistas'),
    'cadastro-consultas': document.getElementById('cadastro-consultas'),
    'consultas-gerais': document.getElementById('consultas-gerais'),
    'consultas-dia': document.getElementById('consultas-dia'),
    'pacientes': document.getElementById('pacientes'),
    'profissionais': document.getElementById('profissionais')
  };

  // Mapeamento dos formulários
  const forms = {
    paciente: document.getElementById('form-paciente'),
    especialista: document.getElementById('form-especialista'),
    consulta: document.getElementById('form-consulta')
  };

  // Carrega os dados do localStorage
  let dbPacientes = JSON.parse(localStorage.getItem('db_pacientes')) || [];
  let dbEspecialistas = JSON.parse(localStorage.getItem('db_especialistas')) || [];
  let dbConsultas = JSON.parse(localStorage.getItem('db_consultas')) || [];

  // Variável global para armazenar o ID em edição
  let editingId = null;

  // Função para salvar dados no localStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Função para mostrar uma seção
  window.showSection = (sectionId) => {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    sections[sectionId].classList.add('active');
  };

  // Função para alternar o menu lateral
  const toggleMenu = () => {
    const menuLateral = document.getElementById('menu-lateral');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    menuLateral.classList.toggle('minimizado');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  };

  // Evento de clique para o botão de minimizar/maximizar
  document.getElementById('toggle-menu').addEventListener('click', toggleMenu);

  // Função para adicionar/atualizar um paciente
  forms.paciente.addEventListener('submit', (e) => {
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
      const index = dbPacientes.findIndex(p => p.id === editingId);
      dbPacientes[index] = paciente;
      editingId = null;
    } else {
      // Adiciona um novo paciente
      dbPacientes.push(paciente);
    }

    saveData('db_pacientes', dbPacientes);
    forms.paciente.reset();
    updatePacientesTable();
    alert('Paciente salvo com sucesso!');
  });

  // Função para editar um paciente
  window.editarPaciente = (id) => {
    const paciente = dbPacientes.find(p => p.id === id);
    if (paciente) {
      document.getElementById('nome-paciente').value = paciente.nome;
      document.getElementById('cpf-paciente').value = paciente.cpf;
      document.getElementById('idade-paciente').value = paciente.idade;
      document.getElementById('responsavel-paciente').value = paciente.responsavel;
      document.getElementById('telefone-paciente').value = paciente.telefone;
      document.getElementById('email-paciente').value = paciente.email;
      document.getElementById('ultima-consulta').value = paciente.ultimaConsulta;
      editingId = paciente.id;
      showSection('cadastro-pacientes');
    }
  };

  // Função para excluir um paciente
  window.excluirPaciente = (id) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      dbPacientes = dbPacientes.filter(p => p.id !== id);
      saveData('db_pacientes', dbPacientes);
      updatePacientesTable();
      alert('Paciente excluído com sucesso!');
    }
  };

  // Função para atualizar a tabela de pacientes
  const updatePacientesTable = () => {
    const tabelaPacientes = document.getElementById('tabela-pacientes').getElementsByTagName('tbody')[0];
    tabelaPacientes.innerHTML = '';
    dbPacientes.forEach(paciente => {
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
  forms.especialista.addEventListener('submit', (e) => {
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
      const index = dbEspecialistas.findIndex(e => e.id === editingId);
      dbEspecialistas[index] = especialista;
      editingId = null;
    } else {
      dbEspecialistas.push(especialista);
    }

    saveData('db_especialistas', dbEspecialistas);
    forms.especialista.reset();
    updateProfissionaisTable();
    alert('Especialista salvo com sucesso!');
  });

  // Função para editar um especialista
  window.editarEspecialista = (id) => {
    const especialista = dbEspecialistas.find(e => e.id === id);
    if (especialista) {
      document.getElementById('nome-especialista').value = especialista.nome;
      document.getElementById('cpf-especialista').value = especialista.cpf;
      document.getElementById('especialidade').value = especialista.especialidade;
      document.getElementById('turno-especialista').value = especialista.turno;
      document.getElementById('telefone-especialista').value = especialista.telefone;
      document.getElementById('email-especialista').value = especialista.email;
      editingId = especialista.id;
      showSection('cadastro-especialistas');
    }
  };

  // Função para excluir um especialista
  window.excluirEspecialista = (id) => {
    if (confirm('Tem certeza que deseja excluir este especialista?')) {
      dbEspecialistas = dbEspecialistas.filter(e => e.id !== id);
      saveData('db_especialistas', dbEspecialistas);
      updateProfissionaisTable();
      alert('Especialista excluído com sucesso!');
    }
  };

  // Função para atualizar a tabela de profissionais
  const updateProfissionaisTable = () => {
    const tabelaProfissionais = document.getElementById('tabela-profissionais').getElementsByTagName('tbody')[0];
    tabelaProfissionais.innerHTML = '';
    dbEspecialistas.forEach(especialista => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${especialista.nome}</td>
        <td class="p-2">${especialista.cpf}</td>
        <td class="p-2">${especialista.especialidade</td>
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

  // Função para adicionar/atualizar uma consulta
  forms.consulta.addEventListener('submit', (e) => {
    e.preventDefault();
    const consulta = {
      id: editingId || Date.now(), // Usa o ID em edição ou gera um novo
      data: document.getElementById('data-consulta').value,
      horario: document.getElementById('horario-consulta').value,
      paciente: document.getElementById('nome-paciente-consulta').value,
      idade: document.getElementById('idade-paciente-consulta').value,
      responsavel: document.getElementById('responsavel-consulta').value,
      telefone: document.getElementById('telefone-consulta').value,
      especialidade: document.getElementById('especialidade-consulta').value,
      consultorio: document.getElementById('consultorio-consulta').value,
      especialista: document.getElementById('especialista-consulta').value
    };

    if (editingId) {
      const index = dbConsultas.findIndex(c => c.id === editingId);
      dbConsultas[index] = consulta;
      editingId = null;
    } else {
      dbConsultas.push(consulta);
    }

    saveData('db_consultas', dbConsultas);
    forms.consulta.reset();
    updateConsultasTables();
    alert('Consulta salva com sucesso!');
  });

  // Função para editar uma consulta
  window.editarConsulta = (id) => {
    const consulta = dbConsultas.find(c => c.id === id);
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
      editingId = consulta.id;
      showSection('cadastro-consultas');
    }
  };

  // Função para excluir uma consulta
  window.excluirConsulta = (id) => {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      dbConsultas = dbConsultas.filter(c => c.id !== id);
      saveData('db_consultas', dbConsultas);
      updateConsultasTables();
      alert('Consulta excluída com sucesso!');
    }
  };

  // Função para atualizar as tabelas de consultas
  const updateConsultasTables = () => {
    const tabelaConsultasGerais = document.getElementById('tabela-consultas-gerais').getElementsByTagName('tbody')[0];
    const tabelaConsultasDia = document.getElementById('tabela-consultas-dia').getElementsByTagName('tbody')[0];
    const hoje = new Date().toISOString().split('T')[0];

    tabelaConsultasGerais.innerHTML = '';
    tabelaConsultasDia.innerHTML = '';

    dbConsultas.forEach(consulta => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${consulta.data}</td>
        <td class="p-2">${consulta.horario}</td>
        <td class="p-2">${consulta.paciente}</td>
        <td class="p-2">${consulta.idade</td>
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
  showSection('cadastro-pacientes');
  updatePacientesTable();
  updateConsultasTables();
  updateProfissionaisTable();

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

// FUNÇÕES DE FILTRO - adicionadas para as abas Consultas Gerais, Consultas do Dia e Pacientes

window.filtrarConsultasGerais = function() {
  const nome = document.getElementById("filter-consulta-geral-nome").value.toLowerCase();
  const data = document.getElementById("filter-consulta-geral-data").value;
  const horario = document.getElementById("filter-consulta-geral-horario").value;
  const table = document.getElementById("tabela-consultas-gerais");
  const tbody = table.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length >= 3) {
      const cellData = cells[0].textContent.trim();
      const cellHorario = cells[1].textContent.trim();
      const cellNome = cells[2].textContent.trim().toLowerCase();
      
      const matchNome = !nome || cellNome.includes(nome);
      const matchData = !data || cellData.includes(data);
      const matchHorario = !horario || cellHorario.includes(horario);
      
      rows[i].style.display = (matchNome && matchData && matchHorario) ? "" : "none";
    }
  }
};

window.filtrarConsultasDia = function() {
  const nome = document.getElementById("filter-consulta-dia-nome").value.toLowerCase();
  const data = document.getElementById("filter-consulta-dia-data").value;
  const horario = document.getElementById("filter-consulta-dia-horario").value;
  const table = document.getElementById("tabela-consultas-dia");
  const tbody = table.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length >= 3) {
      const cellData = cells[0].textContent.trim();
      const cellHorario = cells[1].textContent.trim();
      const cellNome = cells[2].textContent.trim().toLowerCase();

      const matchNome = !nome || cellNome.includes(nome);
      const matchData = !data || cellData.includes(data);
      const matchHorario = !horario || cellHorario.includes(horario);

      rows[i].style.display = (matchNome && matchData && matchHorario) ? "" : "none";
    }
  }
};

window.filtrarPacientes = function() {
  const nome = document.getElementById("filter-paciente-nome").value.toLowerCase();
  const table = document.getElementById("tabela-pacientes");
  const tbody = table.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length > 0) {
      const cellNome = cells[0].textContent.trim().toLowerCase();
      rows[i].style.display = (!nome || cellNome.includes(nome)) ? "" : "none";
    }
  }
};