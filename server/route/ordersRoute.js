const express = require("express")
const { 
  vnpayReturn, 
  vnpayPayment, 
  getOrderBasic, 
  putOrderStatus, 
  filterOrders, 
  countOrder, 
  placeOrder, 
  getOrders, 
  getOrder, 
  getPresentOrder, 
  filterOrdersByCustomerId 
} = require("../controller/ordersController.js")
const { 
  authToken, 
  authTokenFirebase, 
  authRole, 
  authAccountActive 
} = require('../middleware/authMiddleware.js')

const ordersRoute = express.Router()

ordersRoute.get('/vnpay_return', vnpayReturn)

ordersRoute.post(
  '/', 
  authTokenFirebase, 
  authAccountActive, 
  placeOrder
)

ordersRoute.post(
  '/vnpay', 
  authTokenFirebase, 
  authAccountActive, 
  vnpayPayment
)

ordersRoute.get(
  '/', 
  authTokenFirebase, 
  // authAccountActive, 
  getOrders
)

ordersRoute.get(
  '/basic', 
  authTokenFirebase, 
  // authAccountActive, 
  getOrderBasic
)

ordersRoute.get(
  '/state/count/:state', 
  authTokenFirebase, 
  // authAccountActive, 
  countOrder
)

ordersRoute.get(
  '/manage/filter', 
  authTokenFirebase, 
  authRole('admin'), 
  // authAccountActive, 
  filterOrders
)

ordersRoute.get(
  '/filter', 
  authTokenFirebase, 
  // authAccountActive, 
  filterOrdersByCustomerId
)

ordersRoute.get(
  '/detail/:orderId', 
  authTokenFirebase, 
  // authAccountActive, 
  getOrder
)

ordersRoute.get(
  '/present', 
  authTokenFirebase, 
  // authAccountActive, 
  getPresentOrder
)

ordersRoute.put(
  '/status/:orderId', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  putOrderStatus
)

module.exports = ordersRoute