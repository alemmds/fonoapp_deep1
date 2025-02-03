document.addEventListener("DOMContentLoaded", () => {
    // Carrega os usuários do localStorage (se houver) ou define um array vazio
    let dbUsuarios = JSON.parse(localStorage.getItem("db_usuarios")) || [];
    let currentUser = null;

    // Função para salvar dados no localStorage
    const saveData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            alert("Erro ao salvar dados!");
        }
    };

    // Função para exibir apenas a tela (section) desejada no web app
    window.showScreen = (screenId) => {
        document.querySelectorAll(".screen").forEach((screen) => {
            screen.style.display = "none";
        });
        const target = document.getElementById(screenId);
        if (target) target.style.display = "block";
    };

    // Função para "sair" do app (logout) e voltar à tela de login
    window.logout = () => {
        currentUser = null;
        document.getElementById("main-container").style.display = "none";
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
        const novoUser = {
            nome: document.getElementById("register-name").value,
            email: document.getElementById("register-email").value,
            senha: document.getElementById("register-password").value,
            dbPacientes: { pacientes: [] },
            dbCadastro: { especialistas: [] },
            dbConsultas: { consultas: [] }
        };

        if (dbUsuarios.some((u) => u.email === novoUser.email)) {
            alert("E-mail já cadastrado!");
            return;
        }
        dbUsuarios.push(novoUser);
        saveData("db_usuarios", dbUsuarios);
        alert("Cadastro realizado com sucesso!");
        document.getElementById("register-form").reset();
        document.getElementById("register-screen").classList.add("hidden");
        document.getElementById("login-screen").classList.remove("hidden");
    });

    // Login do usuário
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("login-name").value;
        const senha = document.getElementById("login-password").value;

        const user = dbUsuarios.find((u) => u.nome === nome && u.senha === senha);
        if (user) {
            currentUser = user;
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("main-container").style.display = "flex";
            document.getElementById("user-greeting").textContent = `Olá, ${currentUser.nome}`;
            // Exibe a tela de cadastro de pacientes por padrão
            showScreen("cadastro-pacientes");
            updateAllTables();
        } else {
            alert("Credenciais inválidas!");
        }
    });

    // Atualiza todas as tabelas de listagens
    const updateAllTables = () => {
        updateListaPacientes();
        updateListaEspecialistas();
        updateListaConsultas();
    };

    // Atualiza a tabela de pacientes (lista de pacientes)
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

    // Função para editar paciente
    window.editPaciente = (index) => {
        const pac = currentUser.dbPacientes.pacientes[index];
        document.getElementById("paciente-nome").value = pac.nome;
        document.getElementById("paciente-cpf").value = pac.cpf;
        document.getElementById("paciente-idade").value = pac.idade;
        document.getElementById("paciente-responsavel").value = pac.responsavel || "";
        document.getElementById("paciente-telefone").value = pac.telefone;
        document.getElementById("paciente-email").value = pac.email;
        document.getElementById("paciente-ultima-consulta").value = pac.ultimaConsulta || "";
        showScreen("cadastro-pacientes");
    };

    // Função para excluir paciente
    window.deletePaciente = (index) => {
        if (confirm("Confirmar exclusão do paciente?")) {
            currentUser.dbPacientes.pacientes.splice(index, 1);
            saveData("db_usuarios", dbUsuarios);
            updateListaPacientes();
        }
    };

    // Cadastro e edição de especialistas
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
        currentUser.dbCadastro.especialistas.push(especialista);
        saveData("db_usuarios", dbUsuarios);
        updateListaEspecialistas();
        e.target.reset();
    });

    // Atualiza a tabela de especialistas
    const updateListaEspecialistas = () => {
        const tbody = document.querySelector("#tabela-profissionais tbody");
        tbody.innerHTML = "";
        currentUser.dbCadastro.especialistas.forEach((especialista, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${especialista.nome}</td>
                    <td>${especialista.cpf}</td>
                    <td>${especialista.especialidade}</td>
                    <td>${especialista.turno}</td>
                    <td>${especialista.telefone}</td>
                    <td>${especialista.email}</td>
                    <td>
                        <button onclick="editEspecialista(${index})">Editar</button>
                        <button onclick="deleteEspecialista(${index})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    };

    // Função para editar especialista
    window.editEspecialista = (index) => {
        const esp = currentUser.dbCadastro.especialistas[index];
        document.getElementById("especialista-nome").value = esp.nome;
        document.getElementById("especialista-cpf").value = esp.cpf;
        document.getElementById("especialista-especialidade").value = esp.especialidade;
        document.getElementById("especialista-turno").value = esp.turno;
        document.getElementById("especialista-telefone").value = esp.telefone;
        document.getElementById("especialista-email").value = esp.email;
        showScreen("cadastro-especialistas");
    };

    // Função para excluir especialista
    window.deleteEspecialista = (index) => {
        if (confirm("Confirmar exclusão do especialista?")) {
            currentUser.dbCadastro.especialistas.splice(index, 1);
            saveData("db_usuarios", dbUsuarios);
            updateListaEspecialistas();
        }
    };

    // Cadastro e edição de consultas
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
        currentUser.dbConsultas.consultas.push(consulta);
        saveData("db_usuarios", dbUsuarios);
        updateListaConsultas();
        e.target.reset();
    });

    // Atualiza a tabela de consultas
    const updateListaConsultas = () => {
        const tbody = document.querySelector("#tabela-consultas-gerais tbody");
        tbody.innerHTML = "";
        currentUser.dbConsultas.consultas.forEach((consulta, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${consulta.data}</td>
                    <td>${consulta.horario}</td>
                    <td>${consulta.nomePaciente}</td>
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
                </tr>
            `;
        });
    };

    // Função para editar consulta
    window.editConsulta = (index) => {
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

    // Função para excluir consulta
    window.deleteConsulta = (index) => {
        if (confirm("Confirmar exclusão da consulta?")) {
            currentUser.dbConsultas.consultas.splice(index, 1);
            saveData("db_usuarios", dbUsuarios);
            updateListaConsultas();
        }
    };

    // Registra o Service Worker (se disponível)
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((reg) => console.log("SW registrado:", reg))
            .catch((err) => console.error("SW erro:", err));
    }
});
