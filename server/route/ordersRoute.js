import expres from "express"
import { placeOrder, getOrders, filterOrdersByStatus, getOrder } from "../controller/ordersController.js"
import authToken from "../middleware/authToken.js"
const ordersRoute = expres.Router()

ordersRoute.use(authToken)

ordersRoute.post("/", placeOrder)
ordersRoute.get('/', getOrders)
ordersRoute.get("/filter/:status", filterOrdersByStatus)
ordersRoute.get('/detail/:orderId', getOrder)

export default ordersRoute