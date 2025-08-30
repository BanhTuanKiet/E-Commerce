const bcrypt = require("bcrypt")
const ErrorException = require("./errorException")

const hashPassword = async (password) => {
  try {
    const hashed = await bcrypt.hash(password, 10)
    return hashed
  } catch (error) {
    throw new ErrorException(400, "Error hashing password")
  }
}

module.exports = { hashPassword }
