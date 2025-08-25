const express = require("express")
const { signup, authOTP, signin, getUser, putUser, socialLogin } = require("../controller/usersController.js")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const inputValidation = require("../middleware/inputValidation.js")
const { newUser } = require("../util/valideInput.js")
const usersRoute = express.Router()

usersRoute.post('/signup', inputValidation(newUser, 'body'), signup)
usersRoute.post('/auth', authOTP)
usersRoute.post('/signin', signin)
usersRoute.post('/signin/:social', socialLogin)
usersRoute.get('/profile', authTokenFirebase, getUser)
usersRoute.put('/profile', authTokenFirebase, putUser)
// usersRoute.put('/password', null)

module.exports = usersRoute