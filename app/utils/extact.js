const verifyBody = (name, email, password) => {
  const errors = {}
  if (!name) {
    errors.name = 'name no existe'
  } else if (!email) {
    errors.email = 'email is requiered'
  } else if (!password) {
    errors.password = 'password is requiered'
  }

  return errors
}

module.exports = { verifyBody }
