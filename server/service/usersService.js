const usersModel = require('../model/usersModel.js')
const users = require('../model/usersModel.js')

const createUser = async (user) => {
  return await users.create(JSON.parse(JSON.stringify(user)))
}

const userIsExist = async (email) => {
  return await users.findOne({ email: email })
}

const saveSecretKey = async (email, otpSecret) => {
  return await users.updateOne(
    { email: email },
    { $set: { otpSecret: otpSecret } }
  )
}

const saveRefreshToken = async (email, refreshToken) => {
  return await users.updateOne(
    { email: email },
    { refreshToken: refreshToken }
  )
}

const getRefreshToken = async (_id) => {
  return await users.findById(_id).select('refreshToken')
}

const findUserById = async (_id) => {
  return await users.findById(_id).select('-password -refreshToken -__v -role')
}

const updateUser = async (_id, user) => {
  return await users.findOneAndUpdate(
    { _id },
    { $set: { ...user } },
    { new: true }
  )
}

const itemsPerPage = 10

const filterUsers = async (options, page) => {
  const query = {}
  const skipIndex = (page - 1) * itemsPerPage
  console.log(options)

  Object.entries(options).forEach(([key, value]) => {
    if (key === 'role' && value !== 'all') {
      query[key] = { $in: Array.isArray(value) ? value : [value] }
    } else if (key === 'gender' && value !== 'all') {
      query[key] = { $in: Array.isArray(value) ? value : [value] }
    } else if (key === 'search' && value !== '') {
      query.$or = [
        { email: { $regex: value, $options: "i" } },
        { phoneNumber: { $regex: value, $options: "i" } },
        { name: { $regex: value, $options: "i" } },
      ]
    }
  })

  const users = await usersModel
    .find(query)
    .skip(skipIndex)
    .limit(itemsPerPage)

  const totalUsers = await usersModel.countDocuments(query)

  return {
    users,
    totalPages: Math.ceil(totalUsers / itemsPerPage),
  }
}

module.exports = {
  createUser,
  userIsExist,
  saveSecretKey,
  saveRefreshToken,
  getRefreshToken,
  findUserById,
  updateUser,
  filterUsers
}