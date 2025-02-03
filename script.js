document.addEventListener("DOMContentLoaded", () => {
  // Base de dados armazenada em localStorage
  let dbUsuarios = JSON.parse(localStorage.getItem("db_usuarios")) || [];
  let currentUser = null;
  // Índices de edição para cada categoria
  let editingPacienteIndex = null;
  let editingEspecialistaIndex = null;
  let editingConsultaIndex = null;

  // Salvar os dados no localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao salvar dados!");
    }
  };

  // Função para exibir apenas a tela (section) desejada
  window.showScreen = (screenId) => {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.style.display = "none";
    });
    document.getElementById(screenId).style.display = "block";
  };

  // Função para "sair" e voltar à tela de login
  window.logout = () => {
    currentUser = null;
    document.getElementById("main-container").classList.add("hidden");
    document.getElementById("login-screen").style.display = "flex";
  };

  // Alternar entre telas de login e cadastro de usuário
  document.getElementById("show-register").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("register-screen").classList.remove("hidden");
  });
  document.getElementById("show-login").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("register-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
  });

  // Cadastro de novo usuário
  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {
      nome: document.getElementById("register-name").value,
      email: document.getElementById("register-email").value,
      senha: document.getElementById("register-password").value,
      dbPacientes: { pacientes: [] },
      dbCadastro: { especialistas: [] },
      dbConsultas: { consultas: [] },
    };

    if (dbUsuarios.some((u) => u.email === formData.email)) {
      alert("E-mail já cadastrado!");
      return;
    }

    dbUsuarios.push(formData);
    saveData("db_usuarios", dbUsuarios);
    alert("Cadastro realizado!");
    document.getElementById("register-form").reset();
    // Volta para a tela de login
    document.getElementById("register-screen").classList.add("hidden");
    document.getElementById("login-screen").style.display = "flex";
  });

  // Login do usuário
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("login-name").value;
    const senha = document.getElementById("login-password").value;

    const user = dbUsuarios.find((u) => u.nome === nome && u.senha === senha);
    if (user) {
      currentUser = user;
      document.getElementById("login-screen").classList.add("hidden");
      document.getElementById("main-container").classList.remove("hidden");
      document.getElementById("user-greeting").textContent = `Olá, ${currentUser.nome}`;
      // Exibe a tela de cadastro de pacientes por padrão
      showScreen("cadastro-pacientes");
      updateAllTables();
    } else {
      alert("Credenciais inválidas!");
    }
  });

  // Atualiza todas as tabelas de visualização
  const updateAllTables = () => {
    updateListaPacientes();
    updateListaEspecialistas();
    updateListaConsultas();
  };

  // Atualiza a tabela de pacientes
  const updateListaPacientes = () => {
    const tbody = document.querySelector("#tabela-pacientes tbody");
    tbody.innerHTML = "";
    currentUser.dbPacientes.pacientes.forEach((paciente, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${paciente.nome}</td>
          <td>${paciente.cpf}</td>
          <td>${paciente.idade}</td>
          <td>${paciente.responsavel || ""}</td>
          <td>${paciente.telefone}</td>
          <td>${paciente.email}</td>
          <td>${paciente.ultimaConsulta || ""}</td>
          <td>
            <button onclick="editPaciente(${index})">Editar</button>
            <button onclick="deletePaciente(${index})">Excluir</button>
          </td>
        </tr>
      `;
    });
  };

  // Atualiza a tabela de especialistas
  const updateListaEspecialistas = () => {
    const tbody = document.querySelector("#tabela-profissionais tbody");
    tbody.innerHTML = "";
    currentUser.dbCadastro.especialistas.forEach((esp, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${esp.nome}</td>
          <td>${esp.cpf}</td>
          <td>${esp.especialidade}</td>
          <td>${esp.turno}</td>
          <td>${esp.telefone}</td>
          <td>${esp.email}</td>
          <td>
            <button onclick="editEspecialista(${index})">Editar</button>
            <button onclick="deleteEspecialista(${index})">Excluir</button>
          </td>
        </tr>
      `;
    });
  };

  // Atualiza a tabela de consultas
  const updateListaConsultas = () => {
    const tbody = document.querySelector("#tabela-consultas-gerais tbody");
    tbody.innerHTML = "";
    currentUser.dbConsultas.consultas.forEach((cons, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${cons.data}</td>
          <td>${cons.horario}</td>
          <td>${cons.nomePaciente}</td>
          <td>${cons.idade}</td>
          <td>${cons.responsavel || ""}</td>
          <td>${cons.telefone}</td>
          <td>${cons.especialidade}</td>
          <td>${cons.consultorio}</td>
          <td>${cons.especialista}</td>
          <td>
            <button onclick="editConsulta(${index})">Editar</button>
            <button onclick="deleteConsulta(${index})">Excluir</button>
          </td>
        </tr>
      `;
    });
  };

  // CADASTRO / EDIÇÃO DE PACIENTES
  document.getElementById("form-cadastro-paciente").addEventListener("submit", (e) => {
    e.preventDefault();
    const paciente = {
      nome: document.getElementById("paciente-nome").value,
      cpf: document.getElementById("paciente-cpf").value,
      idade: document.getElementById("paciente-idade").value,
      responsavel: document.getElementById("paciente-responsavel").value,
      telefone: document.getElementById("paciente-telefone").value,
      email: document.getElementById("paciente-email").value,
      ultimaConsulta: document.getElementById("paciente-ultima-consulta").value,
    };

    if (editingPacienteIndex !== null) {
      currentUser.dbPacientes.pacientes[editingPacienteIndex] = paciente;
      editingPacienteIndex = null;
    } else {
      currentUser.dbPacientes.pacientes.push(paciente);
    }
    saveData("db_usuarios", dbUsuarios);
    updateListaPacientes();
    e.target.reset();
  });

  // Funções para editar e excluir pacientes
  window.editPaciente = (index) => {
    editingPacienteIndex = index;
    const pac = currentUser.dbPacientes.pacientes[index];
    document.getElementById("paciente-nome").value = pac.nome;
    document.getElementById("paciente-cpf").value = pac.cpf;
    document.getElementById("paciente-idade").value = pac.idade;
    document.getElementById("paciente-responsavel").value = pac.responsavel;
    document.getElementById("paciente-telefone").value = pac.telefone;
    document.getElementById("paciente-email").value = pac.email;
    document.getElementById("paciente-ultima-consulta").value = pac.ultimaConsulta;
    // Exibe a tela de cadastro de pacientes para edição
    showScreen("cadastro-pacientes");
  };
  window.deletePaciente = (index) => {
    if (confirm("Confirmar exclusão do paciente?")) {
      currentUser.dbPacientes.pacientes.splice(index, 1);
      saveData("db_usuarios", dbUsuarios);
      updateListaPacientes();
    }
  };

  // CADASTRO / EDIÇÃO DE ESPECIALISTAS
  document.getElementById("form-cadastro-especialista").addEventListener("submit", (e) => {
    e.preventDefault();
    const especialista = {
      nome: document.getElementById("especialista-nome").value,
      cpf: document.getElementById("especialista-cpf").value,
      especialidade: document.getElementById("especialista-especialidade").value,
      turno: document.getElementById("especialista-turno").value,
      telefone: document.getElementById("especialista-telefone").value,
      email: document.getElementById("especialista-email").value,
    };

    if (editingEspecialistaIndex !== null) {
      currentUser.dbCadastro.especialistas[editingEspecialistaIndex] = especialista;
      editingEspecialistaIndex = null;
    } else {
      currentUser.dbCadastro.especialistas.push(especialista);
    }
    saveData("db_usuarios", dbUsuarios);
    updateListaEspecialistas();
    e.target.reset();
  });
  window.editEspecialista = (index) => {
    editingEspecialistaIndex = index;
    const esp = currentUser.dbCadastro.especialistas[index];
    document.getElementById("especialista-nome").value = esp.nome;
    document.getElementById("especialista-cpf").value = esp.cpf;
    document.getElementById("especialista-especialidade").value = esp.especialidade;
    document.getElementById("especialista-turno").value = esp.turno;
    document.getElementById("especialista-telefone").value = esp.telefone;
    document.getElementById("especialista-email").value = esp.email;
    showScreen("cadastro-especialistas");
  };
  window.deleteEspecialista = (index) => {
    if (confirm("Confirmar exclusão do especialista?")) {
      currentUser.dbCadastro.especialistas.splice(index, 1);
      saveData("db_usuarios", dbUsuarios);
      updateListaEspecialistas();
    }
  };

  // CADASTRO / EDIÇÃO DE CONSULTAS
  document.getElementById("form-cadastro-consulta").addEventListener("submit", (e) => {
    e.preventDefault();
    const consulta = {
      data: document.getElementById("consulta-data").value,
      horario: document.getElementById("consulta-horario").value,
      nomePaciente: document.getElementById("consulta-nomePaciente").value,
      idade: document.getElementById("consulta-idade").value,
      responsavel: document.getElementById("consulta-responsavel").value,
      telefone: document.getElementById("consulta-telefone").value,
      especialidade: document.getElementById("consulta-especialidade").value,
      consultorio: document.getElementById("consulta-consultorio").value,
      especialista: document.getElementById("consulta-especialista").value,
    };

    if (editingConsultaIndex !== null) {
      currentUser.dbConsultas.consultas[editingConsultaIndex] = consulta;
      editingConsultaIndex = null;
    } else {
      currentUser.dbConsultas.consultas.push(consulta);
    }
    saveData("db_usuarios", dbUsuarios);
    updateListaConsultas();
    e.target.reset();
  });
  window.editConsulta = (index) => {
    editingConsultaIndex = index;
    const cons = currentUser.dbConsultas.consultas[index];
    document.getElementById("consulta-data").value = cons.data;
    document.getElementById("consulta-horario").value = cons.horario;
    document.getElementById("consulta-nomePaciente").value = cons.nomePaciente;
    document.getElementById("consulta-idade").value = cons.idade;
    document.getElementById("consulta-responsavel").value = cons.responsavel;
    document.getElementById("consulta-telefone").value = cons.telefone;
    document.getElementById("consulta-especialidade").value = cons.especialidade;
    document.getElementById("consulta-consultorio").value = cons.consultorio;
    document.getElementById("consulta-especialista").value = cons.especialista;
    showScreen("cadastro-consultas");
  };
  window.deleteConsulta = (index) => {
    if (confirm("Confirmar exclusão da consulta?")) {
      currentUser.dbConsultas.consultas.splice(index, 1);
      saveData("db_usuarios", dbUsuarios);
      updateListaConsultas();
    }
  };

  // Registra o Service Worker (se aplicável)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registrado:", reg))
      .catch((err) => console.error("SW erro:", err));
  }
});
