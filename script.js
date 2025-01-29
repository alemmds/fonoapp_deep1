document.addEventListener('DOMContentLoaded', () => {
  const sections = {
    'cadastro-pacientes': document.getElementById('cadastro-pacientes'),
    'cadastro-especialistas': document.getElementById('cadastro-especialistas'),
    'cadastro-consultas': document.getElementById('cadastro-consultas'),
    'consultas-gerais': document.getElementById('consultas-gerais'),
    'consultas-dia': document.getElementById('consultas-dia'),
    'pacientes': document.getElementById('pacientes')
  };

  const forms = {
    paciente: document.getElementById('form-paciente'),
    especialista: document.getElementById('form-especialista'),
    consulta: document.getElementById('form-consulta')
  };

  // Carrega os dados dos arquivos JSON
  let dbCadastro = JSON.parse(localStorage.getItem('db_cadastro')) || { especialistas: [], consultorios: [] };
  let dbPacientes = JSON.parse(localStorage.getItem('db_pacientes')) || { pacientes: [] };
  let dbConsultas = JSON.parse(localStorage.getItem('db_consultas')) || { consultas: [] };

  // Função para salvar dados no LocalStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Função para mostrar uma seção
  window.showSection = (sectionId) => {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    sections[sectionId].classList.add('active');
  };

  // Função para adicionar um paciente
  forms.paciente.addEventListener('submit', (e) => {
    e.preventDefault();
    const paciente = {
      nome: document.getElementById('nome-paciente').value,
      idade: document.getElementById('idade-paciente').value,
      responsavel: document.getElementById('responsavel-paciente').value,
      telefone: document.getElementById('telefone-paciente').value
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
      nome: document.getElementById('nome-especialista').value,
      cpf: document.getElementById('cpf-especialista').value,
      especialidade: document.getElementById('especialidade').value,
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
      data: document.getElementById('data-consulta').value,
      horario: document.getElementById('horario-consulta').value,
      paciente: document.getElementById('nome-paciente').value,
      especialista: document.getElementById('especialista').value
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
      `;
      tabelaPacientes.appendChild(row);
    });
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
        <td class="p-2">${consulta.especialista}</td>
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
});
