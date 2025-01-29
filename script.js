document.addEventListener('DOMContentLoaded', () => {
  const sections = {
    cadastro: document.getElementById('cadastro'),
    consultas: document.getElementById('consultas'),
    pacientes: document.getElementById('pacientes')
  };

  const forms = {
    especialista: document.getElementById('form-especialista'),
    paciente: document.getElementById('form-paciente'),
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

  // Inicialização
  showSection('cadastro'); // Mostra a seção de cadastro por padrão
  updatePacientesTable(); // Atualiza a tabela de pacientes
});
