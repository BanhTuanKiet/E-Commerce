import expres from "express"
import { getCart } from "../controller/cartsController.js"
const cartsRoute = expres.Router()

cartsRoute.get("/:customerId", getCart)

export default cartsRoute