exports.checarAutenticacao = (req, res, next) => {
  console.log('Sessão atual:', req.session); // Adicione esta linha para depurar

  if (req.accepts('json')) {
    if (req.session && req.session.usuario) {
      next();
    } else {
      return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
    }
  } else {
    if (req.session && req.session.usuario) {
      next();
    } else {
      res.redirect("/login");
    }
  }
};