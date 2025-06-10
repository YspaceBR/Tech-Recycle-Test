const conn = require("../config/db");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await conn.promise().query(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    // Salva o usuário na sessão (compatível com seu middleware)
    req.session.usuario = {
      id: rows[0].id,
      nome: rows[0].nome,
      email: rows[0].email,
    };

    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
      redirectUrl: "/principal",
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno ao tentar fazer login.",
    });
  }
};