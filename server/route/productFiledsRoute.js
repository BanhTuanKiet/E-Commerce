const express = require("express")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')
const { getProductFields } = require("../controller/productFieldsController.js")

const productFieldsRoute = express.Router()

productFieldsRoute.get(
  '/:type', 
  authTokenFirebase, 
  authAccountActive, 
  getProductFields
)

module.exports = productFieldsRoute