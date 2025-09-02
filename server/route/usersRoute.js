const express = require("express")
const {
  updateAccount,
  addNewCustomer,
  getFilterUsers,
  signup,
  authOTP,
  signin,
  getUser,
  putUser,
  socialLogin,
  signout,
  changePassword
} = require("../controller/usersController.js")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')
const inputValidation = require("../middleware/inputValidation.js")
const { newUser, newAdmin, updateAccountByAdmin, updatePassword } = require("../util/valideInput.js")

const usersRoute = express.Router()

usersRoute.post(
  '/signup',
  inputValidation(newUser, 'body'),
  signup
)

usersRoute.post('/auth', authOTP)

usersRoute.post('/signin', signin)

usersRoute.post('/signin/:social', socialLogin)

usersRoute.get(
  '/profile',
  authTokenFirebase,
  // authAccountActive, 
  getUser
)

usersRoute.put(
  '/profile',
  authTokenFirebase,
  authAccountActive,
  putUser
)

usersRoute.put(
  '/account/admin',
  inputValidation(updateAccountByAdmin, 'body'),
  authTokenFirebase,
  authRole('admin'),
  authAccountActive,
  updateAccount
)

usersRoute.get(
  '/filters',
  authTokenFirebase,
  authRole('admin'),
  // authAccountActive, 
  getFilterUsers
)

usersRoute.post(
  '/signup/admin',
  inputValidation(newAdmin, 'body'),
  authTokenFirebase,
  authRole('admin'),
  authAccountActive,
  addNewCustomer
)

usersRoute.post(
  '/signout',
  authTokenFirebase,
  signout
)

usersRoute.put(
  '/password',
  authTokenFirebase,
  inputValidation(updatePassword, 'body'),
  changePassword
)

module.exports = usersRoute
