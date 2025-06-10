const express = require("express");
const session = require("express-session");
const path = require("path");
const handlebars = require("express-handlebars");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const authController = require("./controllers/authController");
const conn = require("./config/db");

const app = express();

// Configuração do Handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware para processar corpos de requisição
app.use(express.urlencoded({ extended: true })); // Para formulários HTML
app.use(express.json()); // Para requisições JSON

// Configuração da sessão
app.use(
  session({
    secret: "seu_segredo_muito_secreto", // Substitua por uma string aleatória forte
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Use true em produção com HTTPS
  })
);

// Rotas públicas
app.use("/", publicRoutes);

// Rotas de autenticação (diretamente em app.js)
app.post("/login", authController.login);
app.post("/cadastrar", authController.register);
app.get("/logout", authController.logout);

// Rotas privadas (requerem autenticação)
app.use("/", authMiddleware.checarAutenticacao, authRoutes); // Use authRoutes como rotas privadas

// Exportar o app para uso em testes
module.exports = app;