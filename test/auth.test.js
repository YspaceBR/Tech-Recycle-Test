const request = require("supertest");
const app = require("../app");
const conn = require("../config/db"); 

describe("Testes de Autenticação", () => {
  let agent; 

  beforeEach(async () => {
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0"); 
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios");
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1"); 
    agent = request.agent(app); 
  });


  afterAll(async () => {
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0"); 
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios");
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
    await conn.promise().end(); 
  });

  const registerUser = async (name, email, password) => {
    return await agent
      .post("/cadastrar")
      .send({ nome: name, email: email, senha: password });
  };

  test("Deve registrar um novo usuário com sucesso", async () => {
    const response = await registerUser("Teste Usuário", "teste@usuario.com", "senha123");
    expect(response.statusCode).toBe(200); 
    expect(response.body.sucesso).toBe(true);
    expect(response.body.mensagem).toContain("Usuário cadastrado com sucesso!");
    expect(response.body.redirectUrl).toBe("/login");
  });

  test("Não deve registrar usuário com email já existente", async () => {
    await registerUser("Teste Existente", "existente@usuario.com", "senha456");

    const response = await registerUser("Teste Duplicado", "existente@usuario.com", "outrasenha");

    expect(response.statusCode).toBe(409); 
    expect(response.body.sucesso).toBe(false);
    expect(response.body.mensagem).toContain("E-mail já está em uso.");
  });

  test("Deve fazer login com sucesso", async () => {
    await registerUser("Login User", "login@user.com", "senha123");

    const response = await agent 
      .post("/login")
      .send({
        email: "login@user.com",
        password: "senha123", 
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body.sucesso).toBe(true);
    expect(response.body.mensagem).toContain("Login realizado com sucesso!");
    expect(response.body.redirectUrl).toBe("/principal");

  });

  test("Não deve fazer login com credenciais inválidas", async () => {

    const response = await agent 
      .post("/login")
      .send({
        email: "emailinexistente@usuario.com",
        password: "senhaerrada", 
      });

    expect(response.statusCode).toBe(401); 
    expect(response.body.sucesso).toBe(false);
    expect(response.body.mensagem).toContain("Email ou senha incorretos.");
  });

  test("Deve fazer logout com sucesso", async () => {
  
    await registerUser("Logout User", "logout@user.com", "senha123");
    await agent 
      .post("/login")
      .send({ email: "logout@user.com", password: "senha123" }); 

    const logoutResponse = await agent.get("/logout"); 

    expect(logoutResponse.statusCode).toBe(200); 
    expect(logoutResponse.body.sucesso).toBe(true);
    expect(logoutResponse.body.mensagem).toContain("Logout realizado com sucesso!");
    expect(logoutResponse.body.redirectUrl).toBe("/login");
  });
});


