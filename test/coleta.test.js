const request = require("supertest");
const app = require("../app");
const conn = require("../config/db");
const bcrypt = require("bcryptjs");

describe("Testes de Agendamento de Coleta", () => {
  let agent;
  let userId;

  beforeAll(async () => {
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios");
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
  });

  beforeEach(async () => {
  agent = request.agent(app);

  await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
  await conn.promise().query("DELETE FROM Dispositivo");
  await conn.promise().query("DELETE FROM Coleta");
  await conn.promise().query("DELETE FROM usuarios");
  await conn.promise().query("ALTER TABLE Coleta AUTO_INCREMENT = 1");
  await conn.promise().query("ALTER TABLE Dispositivo AUTO_INCREMENT = 1");
  await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");

  const hashedPassword = await bcrypt.hash("coleta123", 10);

  await conn.promise().query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    ["Usuário Coleta", "coleta@teste.com", hashedPassword]
  );

  const loginRes = await agent.post("/login").send({
    email: "coleta@teste.com",
    password: "coleta123",
  });

  console.log("Login status:", loginRes.status, loginRes.body);
});

  afterAll(async () => {
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.promise().query("DELETE FROM Dispositivo");
    await conn.promise().query("DELETE FROM Coleta");
    await conn.promise().query("DELETE FROM usuarios");
    await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
    await conn.promise().end();
  });

  test("Deve agendar uma nova coleta com sucesso", async () => {
    const response = await agent
      .post("/agendar-coleta")
      .send({
        data: "2025-12-31",
        material: "Eletrônicos",
        local: "Rua Teste, 123",
        peso: "5kg",
        observacao: "Teste de agendamento",
      });

    console.log('Agendamento response:', response.status, response.body);

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.agendamento).toHaveProperty("idColeta");
  });
});