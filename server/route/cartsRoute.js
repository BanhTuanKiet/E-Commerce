const express = require("express")
const { getCart, updateCart, postProductToCart } = require("../controller/cartsController.js")
const { authToken, authTokenFirebase, authAccountActive } = require('../middleware/authMiddleware.js')

const cartsRoute = express.Router()

cartsRoute.use(authTokenFirebase)

cartsRoute.get("/", getCart)
cartsRoute.put("/", authAccountActive, updateCart)
cartsRoute.post("/", authAccountActive, postProductToCart)

module.exports = cartsRoute
