const express = require("express")
const { vnpayPayment, getOrderBasic, putOrderStatus, filterOrders, countOrder, placeOrder, getOrders, getOrder, getPresentOrder, filterOrdersByCustomerId } = require("../controller/ordersController.js")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const authRole = require("../middleware/authRole.js")
const ordersRoute = express.Router()

ordersRoute.use(authTokenFirebase)

ordersRoute.post("/", placeOrder)
ordersRoute.post('/vnpay', vnpayPayment)
ordersRoute.get('/', getOrders)
ordersRoute.get('/basic', getOrderBasic)
ordersRoute.get('/state/count/:state', countOrder)
ordersRoute.get('/manage/filter', authRole('admin'), filterOrders)
ordersRoute.get('/filter', filterOrdersByCustomerId)
ordersRoute.get('/detail/:orderId', getOrder)
ordersRoute.get('/present', getPresentOrder)
ordersRoute.put('/status/:orderId', authRole('admin'), putOrderStatus)

module.exports = ordersRoute