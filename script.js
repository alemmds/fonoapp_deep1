document.addEventListener('DOMContentLoaded', () => {
  // Seções da aplicação
  const sections = {
    'cadastro-pacientes': document.getElementById('cadastro-pacientes'),
    'cadastro-especialistas': document.getElementById('cadastro-especialistas'),
    'cadastro-consultas': document.getElementById('cadastro-consultas'),
    'consultas-gerais': document.getElementById('consultas-gerais'),
    'consultas-dia': document.getElementById('consultas-dia'),
    'pacientes': document.getElementById('pacientes')
  };

  // Formulários
  const forms = {
    paciente: document.getElementById('form-paciente'),
    especialista: document.getElementById('form-especialista'),
    consulta: document.getElementById('form-consulta')
  };

  // Carrega os dados do LocalStorage
  let dbCadastro = JSON.parse(localStorage.getItem('db_cadastro')) || { especialistas: [], consultorios: [] };
  let dbPacientes = JSON.parse(localStorage.getItem('db_pacientes')) || { pacientes: [] };
  let dbConsultas = JSON.parse(localStorage.getItem('db_consultas')) || { consultas: [] };

  // Função para salvar dados no LocalStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Função para mostrar uma seção específica
  window.showSection = (sectionId) => {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    sections[sectionId].classList.add('active');
  };

  // Função para adicionar um paciente
  forms.paciente.addEventListener('submit', (e) => {
    e.preventDefault();
    const paciente = {
      id: Date.now(), // ID único para cada paciente
      nome: document.getElementById('nome-paciente').value,
      cpf: document.getElementById('cpf-paciente')?.value || '',
      idade: document.getElementById('idade-paciente').value,
      responsavel: document.getElementById('responsavel-paciente').value,
      telefone: document.getElementById('telefone-paciente').value,
      email: document.getElementById('email-paciente')?.value || '',
      ultimaConsulta: document.getElementById('ultima-consulta')?.value || ''
    };
    dbPacientes.pacientes.push(paciente);
    saveData('db_pacientes', dbPacientes);
    forms.paciente.reset();
    updatePacientesTable();
  });

  // Função para adicionar um especialista
  forms.especialista.addEventListener('submit', (e) => {
    e.preventDefault();
    const especialista = {
      id: Date.now(), // ID único para cada especialista
      nome: document.getElementById('nome-especialista').value,
      cpf: document.getElementById('cpf-especialista').value,
      especialidade: document.getElementById('especialidade').value,
      turno: document.getElementById('turno-especialista')?.value || '',
      telefone: document.getElementById('telefone-especialista').value,
      email: document.getElementById('email-especialista').value
    };
    dbCadastro.especialistas.push(especialista);
    saveData('db_cadastro', dbCadastro);
    forms.especialista.reset();
  });

  // Função para adicionar uma consulta
  forms.consulta.addEventListener('submit', (e) => {
    e.preventDefault();
    const consulta = {
      id: Date.now(), // ID único para cada consulta
      data: document.getElementById('data-consulta').value,
      horario: document.getElementById('horario-consulta').value,
      paciente: document.getElementById('nome-paciente-consulta').value,
      idade: document.getElementById('idade-paciente-consulta')?.value || '',
      responsavel: document.getElementById('responsavel-consulta')?.value || '',
      telefone: document.getElementById('telefone-consulta')?.value || '',
      especialidade: document.getElementById('especialidade-consulta').value,
      consultorio: document.getElementById('consultorio-consulta').value,
      especialista: document.getElementById('especialista-consulta').value
    };
    dbConsultas.consultas.push(consulta);
    saveData('db_consultas', dbConsultas);
    forms.consulta.reset();
    updateConsultasTables();
  });

  // Função para atualizar a tabela de pacientes
  const updatePacientesTable = () => {
    const tabelaPacientes = document.getElementById('tabela-pacientes').getElementsByTagName('tbody')[0];
    tabelaPacientes.innerHTML = '';
    dbPacientes.pacientes.forEach(paciente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${paciente.nome}</td>
        <td class="p-2">${paciente.idade}</td>
        <td class="p-2">${paciente.responsavel}</td>
        <td class="p-2">${paciente.telefone}</td>
        <td class="p-2">${paciente.email || 'N/A'}</td>
        <td class="p-2">${paciente.ultimaConsulta || 'N/A'}</td>
        <td class="p-2 flex space-x-2">
          <button onclick="editarPaciente(${paciente.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirPaciente(${paciente.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tabelaPacientes.appendChild(row);
    });
  };

  // Função para editar um paciente
  window.editarPaciente = (id) => {
    const paciente = dbPacientes.pacientes.find(p => p.id === id);
    if (paciente) {
      document.getElementById('nome-paciente').value = paciente.nome;
      document.getElementById('cpf-paciente').value = paciente.cpf || '';
      document.getElementById('idade-paciente').value = paciente.idade;
      document.getElementById('responsavel-paciente').value = paciente.responsavel;
      document.getElementById('telefone-paciente').value = paciente.telefone;
      document.getElementById('email-paciente').value = paciente.email || '';
      document.getElementById('ultima-consulta').value = paciente.ultimaConsulta || '';

      // Remove o paciente antigo para evitar duplicação
      dbPacientes.pacientes = dbPacientes.pacientes.filter(p => p.id !== id);
      saveData('db_pacientes', dbPacientes);
      updatePacientesTable();
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
        <td class="p-2">${consulta.idade || 'N/A'}</td>
        <td class="p-2">${consulta.responsavel || 'N/A'}</td>
        <td class="p-2">${consulta.telefone || 'N/A'}</td>
        <td class="p-2">${consulta.especialidade || 'N/A'}</td>
        <td class="p-2">${consulta.consultorio || 'N/A'}</td>
        <td class="p-2">${consulta.especialista || 'N/A'}</td>
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

  // Função para editar uma consulta
  window.editarConsulta = (id) => {
    const consulta = dbConsultas.consultas.find(c => c.id === id);
    if (consulta) {
      document.getElementById('data-consulta').value = consulta.data;
      document.getElementById('horario-consulta').value = consulta.horario;
      document.getElementById('nome-paciente-consulta').value = consulta.paciente;
      document.getElementById('idade-paciente-consulta').value = consulta.idade || '';
      document.getElementById('responsavel-consulta').value = consulta.responsavel || '';
      document.getElementById('telefone-consulta').value = consulta.telefone || '';
      document.getElementById('especialidade-consulta').value = consulta.especialidade || '';
      document.getElementById('consultorio-consulta').value = consulta.consultorio || '';
      document.getElementById('especialista-consulta').value = consulta.especialista || '';

      // Remove a consulta antiga para evitar duplicação
      dbConsultas.consultas = dbConsultas.consultas.filter(c => c.id !== id);
      saveData('db_consultas', dbConsultas);
      updateConsultasTables();
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

  // Inicialização
  showSection('cadastro-pacientes'); // Mostra a seção de cadastro de pacientes por padrão
  updatePacientesTable(); // Atualiza a tabela de pacientes
  updateConsultasTables(); // Atualiza as tabelas de consultas

  // Registrar o Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.error('Falha ao registrar o Service Worker:', error);
        });
    });
  }
});
