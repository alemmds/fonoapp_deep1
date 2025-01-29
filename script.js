document.addEventListener('DOMContentLoaded', () => {
  const forms = {
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

  // Função para adicionar uma nova consulta
  forms.consulta.addEventListener('submit', (e) => {
    e.preventDefault();
    const consulta = {
      data: document.getElementById('data-consulta').value,
      horario: document.getElementById('horario-consulta').value,
      paciente: document.getElementById('nome-paciente').value,
      idade: document.getElementById('idade').value,
      responsavel: document.getElementById('responsavel').value,
      telefone: document.getElementById('telefone').value,
      especialidade: document.getElementById('especialidade').value,
      consultorio: document.getElementById('consultorio').value,
      especialista: document.getElementById('especialista').value
    };
    dbConsultas.consultas.push(consulta);
    saveData('db_consultas', dbConsultas);
    updateTables();
    forms.consulta.reset();
  });

  // Função para atualizar as tabelas de consultas
  const updateTables = () => {
    const consultas = dbConsultas.consultas;
    // Atualize as tabelas conforme necessário
  };

  // Inicialização
  updateTables();
});
