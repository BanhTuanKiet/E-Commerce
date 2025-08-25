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

module.exports = {
   createUser,
   userIsExist,
   saveSecretKey,
   saveRefreshToken,
   getRefreshToken,
   findUserById,
   updateUser
}