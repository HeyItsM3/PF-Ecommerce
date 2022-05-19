const verifyBody = (name, email, password) => {
  const erros = {}
  if (!name) {
    erros.name = 'name no existe'
  } else if (!email) {
    erros.email = 'email is requiered'
  } else if (!password) {
    erros.password = 'password is requiered'
  }

  return erros
}

module.exports = { verifyBody }
