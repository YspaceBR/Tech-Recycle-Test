# 🌱 Tech-Recycle

Sistema web para incentivar o descarte correto de resíduos, com cadastro e login de usuários, funcionalidades de mapa e informações de reciclagem.

---

## 📁 Estrutura do Projeto

```
Tech-Recycle/
├── config/                   # Configuração do banco de dados
│   └── db.js
├── controllers/              # Lógica dos controladores
│   ├── authController.js
│   ├── coletaController.js
│   └── usuarioController.js
├── middlewares/             # Middlewares da aplicação
│   └── authMiddleware.js
├── routes/                  # Definição das rotas
│   ├── authRoutes.js
│   └── publicRoutes.js
├── views/                   # Páginas renderizadas com Handlebars
│   └── auth/
│       └── principal.handlebars
├── assets/                  # Arquivos estáticos (CSS, imagens, fontes)
├── test/                    # Testes automatizados
│   ├── passwordValidator.test.js
│   ├── emailValidator.test.js
│   ├── auth.test.js
│   ├── coleta.test.js
│   └── botaoReciclar.test.js
├── src/                     # Funções auxiliares
│   ├── passwordValidator.js
│   └── emailValidator.js
├── app.js                   # Arquivo principal da aplicação
└── .env                     # Variáveis de ambiente
```

---

## 📦 Tecnologias

- Node.js
- Express
- MySQL
- Handlebars
- bcrypt (hash de senha)
- Jest (testes unitários, integração e funcionais)
- Supertest (testes de API)
- express-session

---

## 🚀 Como rodar localmente

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o `.env` com os dados do MySQL
4. Inicie com `npm start`

---

## ✅ Requisitos Atendidos

### Funcionais
- Cadastro e login de usuários
- Visualização de pontos de coleta no mapa
- Agendamento de coletas com data e local

### Não Funcionais
- Armazenamento seguro de senhas com hash (bcrypt)
- Cobertura completa de testes (unitários, integração e funcionais)

---

## 🧪 Estratégia de Testes

Este projeto implementa uma **estratégia completa de testes** cobrindo diferentes níveis da aplicação, garantindo qualidade e confiabilidade do código.

### 📋 Tipos de Testes Implementados

#### 1. 🔧 **Testes Unitários**
Testam **funções individuais** de forma isolada, validando a lógica de negócio.

#### 2. 🔗 **Testes de Integração**
Verificam a **comunicação entre componentes**, incluindo banco de dados e APIs.

#### 3. 🎯 **Testes Funcionais**
Validam **fluxos completos** da aplicação, simulando o comportamento do usuário.

#### 4. 🖼️ **Testes de Template**
Garantem que os **templates Handlebars** são renderizados corretamente.

---

## 🔧 Testes Unitários

### Validação de Senha (`passwordValidator.test.js`)

Testa a função que valida requisitos mínimos de segurança para senhas.

**Requisitos validados:**
- Mínimo 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos um número

```javascript
test('Senha válida com letras maiúsculas e números', () => {
  expect(isPasswordValid('Senha123')).toBe(true);
});

test('Senha muito curta', () => {
  expect(isPasswordValid('S1')).toBe(false);
});
```

### Validação de E-mail (`emailValidator.test.js`)

Testa a função que valida formato de e-mails.

```javascript
test('E-mails válidos', () => {
  expect(isValidEmail('exemplo@email.com')).toBe(true);
  expect(isValidEmail('usuario123@dominio.org')).toBe(true);
});

test('E-mails inválidos', () => {
  expect(isValidEmail('texto-sem-arroba.com')).toBe(false);
  expect(isValidEmail('usuario@dominio..com')).toBe(false);
});
```

---

## 🔗 Testes de Integração

### Sistema de Autenticação (`auth.test.js`)

Testa a **integração completa** do sistema de autenticação com banco de dados e sessões.

```javascript
test("Deve registrar um novo usuário com sucesso", async () => {
  const response = await registerUser("Teste Usuário", "teste@usuario.com", "senha123");
  expect(response.statusCode).toBe(200);
  expect(response.body.sucesso).toBe(true);
});
```

```javascript
test("Deve fazer login com sucesso", async () => {
  await registerUser("Login User", "login@user.com", "senha123");
  const response = await agent.post("/login").send({ email: "login@user.com", password: "senha123" });
  expect(response.statusCode).toBe(200);
  expect(response.body.sucesso).toBe(true);
});
```

---

## 🎯 Testes Funcionais

### Sistema de Agendamento (`coleta.test.js`)

Testa **fluxos completos** do sistema de agendamento de coletas.

```javascript
test("Deve agendar uma nova coleta com sucesso", async () => {
  const response = await agent.post("/agendar-coleta").send({
    data: "2025-12-31",
    material: "Eletrônicos",
    local: "Rua Teste, 123",
    peso: "5kg",
    observacao: "Teste de agendamento"
  });
  expect([200, 201]).toContain(response.statusCode);
  expect(response.body.sucesso).toBe(true);
});
```

```javascript
test("Não deve agendar coleta sem autenticação", async () => {
  const response = await unauthenticatedAgent.post("/agendar-coleta").send({ /* dados */ });
  expect(response.statusCode).toBe(401);
});
```

---

## 🖼️ Testes de Template

Valida se os **templates Handlebars** são renderizados corretamente.

```javascript
describe('Template principal.handlebars', () => {
  it('deve conter o botão com classe pontos-reciclar', () => {
    const rendered = template({});
    expect(rendered).toContain('class="pontos-reciclar"');
  });
});
```

---

## 🛠️ Configuração dos Testes

```bash
npm install jest supertest --save-dev
```

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

```bash
npm test
```

---

## 📊 Exemplo de Saída dos Testes

```
PASS  test/passwordValidator.test.js
PASS  test/emailValidator.test.js  
PASS  test/auth.test.js
PASS  test/coleta.test.js
PASS  test/botaoReciclar.test.js
```

---

## 🏗️ Configuração Especial dos Testes

### Gerenciamento de Banco de Dados

```javascript
beforeEach(async () => {
  await conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
  await conn.promise().query("DELETE FROM Dispositivo");
  await conn.promise().query("DELETE FROM Coleta");
  await conn.promise().query("DELETE FROM usuarios");
  await conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
});
```

### Gerenciamento de Sessões

```javascript
let agent = request.agent(app);
```

---

## ✅ Benefícios da Estratégia de Testes

- 🛡️ Previne regressões
- 🔍 Detecta bugs antecipadamente
- 📝 Documenta comportamento do sistema
- 🚀 Facilita manutenção
- ⚡ Automatiza CI/CD
- 🎯 Garante confiabilidade