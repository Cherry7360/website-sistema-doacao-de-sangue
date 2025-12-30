
/* Verifica se o usuário está autenticado e se possui uma das roles permitidas.
 Recebe rolesPermitidos como parâmetro, valida req.user e compara com rolesPermitidos.
 Retorna 401 se não autenticado, 403 se role não for permitida; chama next() caso válido.
*/
 export const verificarRole = (...rolesPermitidos) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ mensagem: 'Não autenticado' });

  if (!rolesPermitidos.includes(req.user.role)) {
    return res.status(403).json({ mensagem: 'Acesso negado' });
  }

  next();
};


