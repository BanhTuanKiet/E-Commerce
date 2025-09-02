const bcrypt = require("bcrypt")
const ErrorException = require("./errorException")

const comparePassword = async (originalPassword, currentPassword) => {
  try {
    await bcrypt.compare(currentPassword, originalPassword)
  } catch (error) {
    throw new ErrorException(400, "Current password incorrect")
  }
}

const hashPassword = async (password) => {
  try {
    const hashed = await bcrypt.hash(password, 10)
    return hashed
  } catch (error) {
    throw new ErrorException(400, "Error hashing password")
  }
}

module.exports = {
  comparePassword,
  hashPassword
}
