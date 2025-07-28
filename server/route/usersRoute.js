import expres from "express"
import { signup, authOTP, signin, getUser, putUser } from "../controller/usersController.js"
import authToken from "../middleware/authToken.js"
const usersRoute = expres.Router()

usersRoute.post('/signup', signup)
usersRoute.post('/auth', authOTP)
usersRoute.post('/signin', signin)
usersRoute.get('/profile', authToken, getUser)
usersRoute.put('/profile', authToken, putUser)
// usersRoute.put('/password', null)

export default usersRoute