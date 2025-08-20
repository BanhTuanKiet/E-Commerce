import expres from "express"
import { signup, authOTP, signin, getUser, putUser } from "../controller/usersController.js"
import authToken from "../middleware/authToken.js"
import { inputValidation } from "../middleware/inputValidation.js"
import { newUser } from "../util/valideInput.js"
const usersRoute = expres.Router()

usersRoute.post('/signup', inputValidation(newUser, 'body'), signup)
usersRoute.post('/auth', authOTP)
usersRoute.post('/signin', signin)
usersRoute.get('/profile', authToken, getUser)
usersRoute.put('/profile', authToken, putUser)
// usersRoute.put('/password', null)

export default usersRoute