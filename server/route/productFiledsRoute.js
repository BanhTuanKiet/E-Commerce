const express = require("express")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const { getProductFields } = require("../controller/productFieldsController.js")
const productFieldsRoute = express.Router()

productFieldsRoute.use(authTokenFirebase)

productFieldsRoute.get('/:type', getProductFields)

module.exports = productFieldsRoute