import expres from "express"
import { signup } from "../controller/usersController.js"
const usersRoute = expres.Router()

usersRoute.post('/', signup)

export default usersRoute