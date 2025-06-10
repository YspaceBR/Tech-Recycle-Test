const request = require("supertest");
const app = require("../app");
const conn = require("../config/db"); // Importar a conexão com o banco de dados

describe("Testes de Autenticação", () => {
  let agent; // Declare agent here to be initialized in beforeEach

  // Limpar o banco de dados antes de cada teste e inicializar um novo agente
  beforeEach(async () => {
    // Excluir registros de Dispositivo e Coleta antes de excluir usuários
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0"); // Desabilitar verificação de chave estrangeira
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios");
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1"); // Habilitar verificação de chave estrangeira
    agent = request.agent(app); // Inicializar um novo agente para cada teste
  });

  // Fechar a conexão do pool após todos os testes
  afterAll(async () => {
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0"); // Desabilitar verificação de chave estrangeira
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios"); // Limpar novamente para garantir
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1"); // Habilitar verificação de chave estrangeira
    await conn.promise().end(); // Re-adicionar o fechamento da conexão aqui
  });

  // Helper para registrar um usuário (usando o agente)
  const registerUser = async (name, email, password) => {
    return await agent
      .post("/cadastrar")
      .send({ nome: name, email: email, senha: password });
  };

  test("Deve registrar um novo usuário com sucesso", async () => {
    const response = await registerUser("Teste Usuário", "teste@usuario.com", "senha123");
    expect(response.statusCode).toBe(200); // Agora retorna 200 OK com JSON
    expect(response.body.sucesso).toBe(true);
    expect(response.body.mensagem).toContain("Usuário cadastrado com sucesso!");
    expect(response.body.redirectUrl).toBe("/login");
  });

  test("Não deve registrar usuário com email já existente", async () => {
    // Primeiro, registre um usuário
    await registerUser("Teste Existente", "existente@usuario.com", "senha456");

    // Tente registrar com o mesmo email novamente
    const response = await registerUser("Teste Duplicado", "existente@usuario.com", "outrasenha");

    expect(response.statusCode).toBe(409); // Agora retorna 409 Conflict com JSON
    expect(response.body.sucesso).toBe(false);
    expect(response.body.mensagem).toContain("E-mail já está em uso.");
  });

  test("Deve fazer login com sucesso", async () => {
    // Garante que o usuário existe para o login dentro deste teste
    await registerUser("Login User", "login@user.com", "senha123");

    const response = await agent // Usar o agente para a requisição de login
      .post("/login")
      .send({
        email: "login@user.com",
        password: "senha123", // Corrigido: \'senha\' para \'password\'
      });

    expect(response.statusCode).toBe(200); // Agora retorna 200 OK com JSON
    expect(response.body.sucesso).toBe(true);
    expect(response.body.mensagem).toContain("Login realizado com sucesso!");
    expect(response.body.redirectUrl).toBe("/principal");
    // O agente gerencia os cookies automaticamente
  });

  test("Não deve fazer login com credenciais inválidas", async () => {
    // Não é necessário registrar usuário para este teste
    const response = await agent // Usar o agente
      .post("/login")
      .send({
        email: "emailinexistente@usuario.com",
        password: "senhaerrada", // Corrigido: \'senha\' para \'password\'
      });

    expect(response.statusCode).toBe(401); // Agora retorna 401 Unauthorized com JSON
    expect(response.body.sucesso).toBe(false);
    expect(response.body.mensagem).toContain("Email ou senha incorretos.");
  });

  test("Deve fazer logout com sucesso", async () => {
    // Garante que o usuário existe e está logado usando o mesmo agente
    await registerUser("Logout User", "logout@user.com", "senha123");
    await agent // Fazer login com o mesmo agente para estabelecer a sessão
      .post("/login")
      .send({ email: "logout@user.com", password: "senha123" }); // Corrigido: \'senha\' para \'password\'

    const logoutResponse = await agent.get("/logout"); // O agente envia os cookies automaticamente

    expect(logoutResponse.statusCode).toBe(200); // Agora retorna 200 OK com JSON
    expect(logoutResponse.body.sucesso).toBe(true);
    expect(logoutResponse.body.mensagem).toContain("Logout realizado com sucesso!");
    expect(logoutResponse.body.redirectUrl).toBe("/login");
  });
});


