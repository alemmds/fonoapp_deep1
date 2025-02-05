import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  // MÓDULO DE LOGIN POR SENHA
  const loginScreen = document.getElementById('login-screen');
  const loginForm = document.getElementById('login-form');
  const loginPassword = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');

  // Exibe a tela de login assim que a página carrega
  loginScreen.style.display = 'flex';

  // Adiciona log para verificar o valor da senha enviada
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valorSenha = loginPassword.value.trim();
    console.log('Valor digitado no login:', valorSenha); // Debug

    if (valorSenha === 'Clinicafono1570') {
      console.log('Senha correta!'); // Debug
      loginScreen.style.display = 'none';
      showSection('welcome');
    } else {
      console.log('Senha incorreta!'); // Debug
      loginError.classList.remove('hidden');
    }
  });

  // Mapeamento das seções
  const sections = {
    'welcome': document.getElementById('welcome'),
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

  // Variáveis globais para edição
  let editingPacienteId = null;
  let editingEspecialistaId = null;
  let editingConsultaId = null;

  // Função para mostrar uma seção específica
  window.showSection = (sectionId) => {
    Object.entries(sections).forEach(([key, section]) => {
      if (key === sectionId) {
        section.classList.remove('hidden');
        section.classList.add('active', 'fade-in');
      } else {
        section.classList.add('hidden');
        section.classList.remove('active');
      }
    });
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
  document.getElementById('toggle-menu').addEventListener('click', toggleMenu);

  // ================== OPERAÇÕES COM PACIENTES ==================
  if (forms.paciente) {
    forms.paciente.addEventListener('submit', async (e) => {
      e.preventDefault();
      const paciente = {
        nome: document.getElementById('nome-paciente').value,
        cpf: document.getElementById('cpf-paciente').value,
        idade: document.getElementById('idade-paciente').value,
        responsavel: document.getElementById('responsavel-paciente').value,
        telefone: document.getElementById('telefone-paciente').value,
        email: document.getElementById('email-paciente').value,
        ultimaConsulta: document.getElementById('ultima-consulta').value
      };

      if (editingPacienteId) {
        const { error } = await supabase
          .from('pacientes')
          .update(paciente)
          .eq('id', editingPacienteId);
        if (error) {
          console.error('Erro ao atualizar paciente:', error);
          alert('Erro ao atualizar paciente!');
        } else {
          alert('Paciente atualizado com sucesso!');
          editingPacienteId = null;
        }
      } else {
        const { error } = await supabase
          .from('pacientes')
          .insert([paciente]);
        if (error) {
          console.error('Erro ao cadastrar paciente:', error);
          alert('Erro ao cadastrar paciente!');
        } else {
          alert('Paciente cadastrado com sucesso!');
        }
      }
      forms.paciente.reset();
      updatePacientesTable();
    });
  }

  window.updatePacientesTable = async function () {
    const { data: pacientes, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pacientes:', error);
      return;
    }
    
    const tabela = document.getElementById('tabela-pacientes');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    pacientes.forEach(paciente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${paciente.nome}</td>
        <td class="p-2">${paciente.cpf}</td>
        <td class="p-2">${paciente.idade}</td>
        <td class="p-2">${paciente.responsavel}</td>
        <td class="p-2">${paciente.telefone}</td>
        <td class="p-2">${paciente.email}</td>
        <td class="p-2">${paciente.ultimaConsulta || ''}</td>
        <td class="p-2">
          <button onclick="editarPaciente('${paciente.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirPaciente('${paciente.id}')" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  };

  window.editarPaciente = async function (id) {
    const { data: paciente, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Erro ao buscar paciente para edição:', error);
      return;
    }
    editingPacienteId = id;
    document.getElementById('nome-paciente').value = paciente.nome;
    document.getElementById('cpf-paciente').value = paciente.cpf;
    document.getElementById('idade-paciente').value = paciente.idade;
    document.getElementById('responsavel-paciente').value = paciente.responsavel;
    document.getElementById('telefone-paciente').value = paciente.telefone;
    document.getElementById('email-paciente').value = paciente.email;
    document.getElementById('ultima-consulta').value = paciente.ultimaConsulta || '';
    showSection('cadastro-pacientes');
  };

  window.excluirPaciente = async function (id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Erro ao excluir paciente:', error);
        alert('Erro ao excluir paciente!');
      } else {
        updatePacientesTable();
      }
    }
  };

  // ================== OPERAÇÕES COM ESPECIALISTAS ==================
  if (forms.especialista) {
    forms.especialista.addEventListener('submit', async (e) => {
      e.preventDefault();
      const especialista = {
        nome: document.getElementById('nome-especialista').value,
        cpf: document.getElementById('cpf-especialista').value,
        especialidade: document.getElementById('especialidade-especialista').value,
        turno: document.getElementById('turno-especialista').value,
        telefone: document.getElementById('telefone-especialista').value,
        email: document.getElementById('email-especialista').value
      };

      if (editingEspecialistaId) {
        const { error } = await supabase
          .from('especialistas')
          .update(especialista)
          .eq('id', editingEspecialistaId);
        if (error) {
          console.error('Erro ao atualizar especialista:', error);
          alert('Erro ao atualizar especialista!');
        } else {
          alert('Especialista atualizado com sucesso!');
          editingEspecialistaId = null;
        }
      } else {
        const { error } = await supabase
          .from('especialistas')
          .insert([especialista]);
        if (error) {
          console.error('Erro ao cadastrar especialista:', error);
          alert('Erro ao cadastrar especialista!');
        } else {
          alert('Especialista cadastrado com sucesso!');
        }
      }
      forms.especialista.reset();
      updateProfissionaisTable();
    });
  }

  window.updateProfissionaisTable = async function () {
    const { data: especialistas, error } = await supabase
      .from('especialistas')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erro ao buscar especialistas:', error);
      return;
    }
    
    const tabela = document.getElementById('tabela-profissionais');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    especialistas.forEach(especialista => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${especialista.nome}</td>
        <td class="p-2">${especialista.cpf}</td>
        <td class="p-2">${especialista.especialidade}</td>
        <td class="p-2">${especialista.turno}</td>
        <td class="p-2">${especialista.telefone}</td>
        <td class="p-2">${especialista.email}</td>
        <td class="p-2">
          <button onclick="editarEspecialista('${especialista.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirEspecialista('${especialista.id}')" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  };

  window.editarEspecialista = async function (id) {
    const { data: especialista, error } = await supabase
      .from('especialistas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar especialista para edição:', error);
      return;
    }
    editingEspecialistaId = id;
    document.getElementById('nome-especialista').value = especialista.nome;
    document.getElementById('cpf-especialista').value = especialista.cpf;
    document.getElementById('especialidade-especialista').value = especialista.especialidade;
    document.getElementById('turno-especialista').value = especialista.turno;
    document.getElementById('telefone-especialista').value = especialista.telefone;
    document.getElementById('email-especialista').value = especialista.email;
    showSection('cadastro-especialistas');
  };

  window.excluirEspecialista = async function (id) {
    if (confirm('Tem certeza que deseja excluir este especialista?')) {
      const { error } = await supabase
        .from('especialistas')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Erro ao excluir especialista:', error);
        alert('Erro ao excluir especialista!');
      } else {
        updateProfissionaisTable();
      }
    }
  };

  // ================== OPERAÇÕES COM CONSULTAS ==================
  if (forms.consulta) {
    forms.consulta.addEventListener('submit', async (e) => {
      e.preventDefault();
      const consulta = {
        data: document.getElementById('data-consulta').value,
        horario: document.getElementById('horario-consulta').value,
        paciente: document.getElementById('paciente-consulta').value,
        idade: document.getElementById('idade-consulta').value,
        responsavel: document.getElementById('responsavel-consulta').value,
        telefone: document.getElementById('telefone-consulta').value,
        especialidade: document.getElementById('especialidade-consulta').value,
        consultorio: document.getElementById('consultorio-consulta').value,
        especialista: document.getElementById('especialista-consulta').value
      };

      if (editingConsultaId) {
        const { error } = await supabase
          .from('consultas')
          .update(consulta)
          .eq('id', editingConsultaId);
        if (error) {
          console.error('Erro ao atualizar consulta:', error);
          alert('Erro ao atualizar consulta!');
        } else {
          alert('Consulta atualizada com sucesso!');
          editingConsultaId = null;
        }
      } else {
        const { error } = await supabase
          .from('consultas')
          .insert([consulta]);
        if (error) {
          console.error('Erro ao cadastrar consulta:', error);
          alert('Erro ao cadastrar consulta!');
        } else {
          alert('Consulta cadastrada com sucesso!');
        }
      }
      forms.consulta.reset();
      updateConsultasTables();
    });
  }

  window.updateConsultasTables = async function () {
    // Atualiza a tabela geral de consultas
    const { data: consultas, error } = await supabase
      .from('consultas')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erro ao buscar consultas:', error);
      return;
    }
    
    const tabelaGeral = document.getElementById('tabela-consultas-gerais');
    const tbodyGeral = tabelaGeral.querySelector('tbody');
    tbodyGeral.innerHTML = '';

    consultas.forEach(consulta => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${consulta.data}</td>
        <td class="p-2">${consulta.horario}</td>
        <td class="p-2">${consulta.paciente}</td>
        <td class="p-2">${consulta.idade || ''}</td>
        <td class="p-2">${consulta.responsavel || ''}</td>
        <td class="p-2">${consulta.telefone || ''}</td>
        <td class="p-2">${consulta.especialidade || ''}</td>
        <td class="p-2">${consulta.consultorio || ''}</td>
        <td class="p-2">${consulta.especialista || ''}</td>
        <td class="p-2">
          <button onclick="editarConsulta('${consulta.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirConsulta('${consulta.id}')" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tbodyGeral.appendChild(row);
    });

    // Atualiza a tabela de consultas do dia
    const tabelaDia = document.getElementById('tabela-consultas-dia');
    const tbodyDia = tabelaDia.querySelector('tbody');
    tbodyDia.innerHTML = '';

    consultas.forEach(consulta => {
      const rowDia = document.createElement('tr');
      rowDia.innerHTML = `
        <td class="p-2">${consulta.data}</td>
        <td class="p-2">${consulta.horario}</td>
        <td class="p-2">${consulta.paciente}</td>
        <td class="p-2">${consulta.idade || ''}</td>
        <td class="p-2">${consulta.responsavel || ''}</td>
        <td class="p-2">${consulta.telefone || ''}</td>
        <td class="p-2">${consulta.especialidade || ''}</td>
        <td class="p-2">${consulta.consultorio || ''}</td>
        <td class="p-2">${consulta.especialista || ''}</td>
        <td class="p-2">
          <button onclick="editarConsulta('${consulta.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
          <button onclick="excluirConsulta('${consulta.id}')" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
        </td>
      `;
      tbodyDia.appendChild(rowDia);
    });
  };

  window.editarConsulta = async function (id) {
    const { data: consulta, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar consulta para edição:', error);
      return;
    }
    editingConsultaId = id;
    document.getElementById('data-consulta').value = consulta.data;
    document.getElementById('horario-consulta').value = consulta.horario;
    document.getElementById('paciente-consulta').value = consulta.paciente;
    document.getElementById('idade-consulta').value = consulta.idade;
    document.getElementById('responsavel-consulta').value = consulta.responsavel;
    document.getElementById('telefone-consulta').value = consulta.telefone;
    document.getElementById('especialidade-consulta').value = consulta.especialidade;
    document.getElementById('consultorio-consulta').value = consulta.consultorio;
    document.getElementById('especialista-consulta').value = consulta.especialista;
    showSection('cadastro-consultas');
  };

  window.excluirConsulta = async function (id) {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      const { error } = await supabase
        .from('consultas')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Erro ao excluir consulta:', error);
        alert('Erro ao excluir consulta!');
      } else {
        updateConsultasTables();
      }
    }
  };

  // ================== FUNÇÕES DE FILTRO ==================
  window.filtrarConsultasGerais = function() {
    const nome = document.getElementById("filter-consulta-geral-nome").value.toLowerCase();
    const data = document.getElementById("filter-consulta-geral-data").value;
    const horario = document.getElementById("filter-consulta-geral-horario").value;
    const tabela = document.getElementById("tabela-consultas-gerais");
    const tbody = tabela.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
  
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 3) {
        const cellData = cells[0].textContent.trim();
        const cellHorario = cells[1].textContent.trim();
        const cellNome = cells[2].textContent.trim().toLowerCase();
  
        const matchNome = !nome || cellNome.includes(nome);
        const matchData = !data || cellData.includes(data);
        const matchHorario = !horario || cellHorario.includes(horario);
  
        row.style.display = (matchNome && matchData && matchHorario) ? "" : "none";
      }
    });
  };
  
  window.filtrarConsultasDia = function() {
    const nome = document.getElementById("filter-consulta-dia-nome").value.toLowerCase();
    const data = document.getElementById("filter-consulta-dia-data").value;
    const horario = document.getElementById("filter-consulta-dia-horario").value;
    const tabela = document.getElementById("tabela-consultas-dia");
    const tbody = tabela.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
  
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 3) {
        const cellData = cells[0].textContent.trim();
        const cellHorario = cells[1].textContent.trim();
        const cellNome = cells[2].textContent.trim().toLowerCase();
  
        const matchNome = !nome || cellNome.includes(nome);
        const matchData = !data || cellData.includes(data);
        const matchHorario = !horario || cellHorario.includes(horario);
  
        row.style.display = (matchNome && matchData && matchHorario) ? "" : "none";
      }
    });
  };
  
  window.filtrarPacientes = function() {
    const nome = document.getElementById("filter-paciente-nome").value.toLowerCase();
    const tabela = document.getElementById("tabela-pacientes");
    const tbody = tabela.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
  
    rows.forEach(row => {
      const cellNome = row.querySelector("td").textContent.trim().toLowerCase();
      row.style.display = (!nome || cellNome.includes(nome)) ? "" : "none";
    });
  };

  // Inicializa as tabelas com os dados do Supabase
  updatePacientesTable();
  updateConsultasTables();
  updateProfissionaisTable();

  // Registro do Service Worker (se suportado)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.error('Falha ao registrar o Service Worker:', error);
        });
    });
  }
});
