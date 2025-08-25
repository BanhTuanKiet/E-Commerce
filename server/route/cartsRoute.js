const express = require("express")
const { getCart, updateCart, postProductToCart } = require("../controller/cartsController.js")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")

const cartsRoute = express.Router()

cartsRoute.use(authTokenFirebase)

cartsRoute.get("/", getCart)
cartsRoute.put("/", updateCart)
cartsRoute.post("/", postProductToCart)

module.exports = cartsRoute
