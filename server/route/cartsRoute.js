import expres from "express"
import { getCart, updateCart, postProductToCart } from "../controller/cartsController.js"
import authToken from "../middleware/authToken.js"
const cartsRoute = expres.Router()

cartsRoute.use(authToken)

cartsRoute.get("/", getCart)
cartsRoute.put('/', updateCart)
cartsRoute.post("/", postProductToCart)

export default cartsRoute