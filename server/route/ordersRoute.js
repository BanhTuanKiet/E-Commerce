import expres from "express"
import { getOrderBasic, putOrderStatus, filterOrders, countOrder, placeOrder, getOrders, getOrder, getPresentOrder, filterOrdersByCustomerId } from "../controller/ordersController.js"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from "../middleware/authTokenFirebase.js"
import { authRole } from "../middleware/authRole.js"
const ordersRoute = expres.Router()

ordersRoute.use(authTokenFirebase)

ordersRoute.post("/", placeOrder)
ordersRoute.get('/', getOrders)
ordersRoute.get('/basic', getOrderBasic)
ordersRoute.get('/state/count/:state', countOrder)
ordersRoute.get('/manage/filter', authRole('admin'), filterOrders)
ordersRoute.get('/filter', filterOrdersByCustomerId)
ordersRoute.get('/detail/:orderId', getOrder)
ordersRoute.get('/present', getPresentOrder)
ordersRoute.put('/status/:orderId', authRole('admin'), putOrderStatus)

export default ordersRoute