import expres from "express"
import { signup, authOTP, signin } from "../controller/usersController.js"
const usersRoute = expres.Router()

usersRoute.post('/signup', signup)
usersRoute.post('/auth', authOTP)
usersRoute.post('/signin', signin)
export default usersRoute