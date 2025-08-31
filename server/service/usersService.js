const User = require('../model/usersModel.js')

const createUser = async (user) => {
  return await User.create(JSON.parse(JSON.stringify(user)))
}

const userIsExist = async (email) => {
  return await User.findOne({ email: email })
}

const saveSecretKey = async (email, otpSecret) => {
  return await User.updateOne(
    { email: email },
    { $set: { otpSecret: otpSecret } }
  )
}

const saveRefreshToken = async (email, refreshToken) => {
  return await User.updateOne(
    { email: email },
    { refreshToken: refreshToken }
  )
}

const getRefreshToken = async (_id) => {
  return await User.findById(_id).select('refreshToken')
}

const findUserById = async (_id) => {
  return await User.findById(_id).select('-password -refreshToken -__v -role')
}

const updateUser = async (_id, user) => {
  return await User.findOneAndUpdate(
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

  const users = await User
    .find(query)
    .skip(skipIndex)
    .limit(itemsPerPage)

  const totalUsers = await User.countDocuments(query)

  return {
    users,
    totalPages: Math.ceil(totalUsers / itemsPerPage),
  }
}

const checkIsActive = async (_id) => {
  const user = await User.findById(_id).select("isActive")
  return user?.isActive || false
}

module.exports = {
  createUser,
  userIsExist,
  saveSecretKey,
  saveRefreshToken,
  getRefreshToken,
  findUserById,
  updateUser,
  filterUsers,
  checkIsActive
}