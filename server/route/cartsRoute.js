import expres from "express"
import { getCart, updateCart, postProductToCart } from "../controller/cartsController.js"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from "../middleware/authTokenFirebase.js"
const cartsRoute = expres.Router()

cartsRoute.use(authTokenFirebase)

cartsRoute.get("/", getCart)
cartsRoute.put('/', updateCart)
cartsRoute.post("/", postProductToCart)

export default cartsRoute