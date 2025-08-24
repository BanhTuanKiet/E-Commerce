import expres from "express"
import { signup, authOTP, signin, getUser, putUser, socialLogin } from "../controller/usersController.js"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from '../middleware/authTokenFirebase.js'
import { inputValidation } from "../middleware/inputValidation.js"
import { newUser } from "../util/valideInput.js"
const usersRoute = expres.Router()

usersRoute.post('/signup', inputValidation(newUser, 'body'), signup)
usersRoute.post('/auth', authOTP)
usersRoute.post('/signin', signin)
usersRoute.post('/signin/:social', socialLogin)
usersRoute.get('/profile', authTokenFirebase, getUser)
usersRoute.put('/profile', authTokenFirebase, putUser)
// usersRoute.put('/password', null)

export default usersRoute