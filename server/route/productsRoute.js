const express = require("express")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const authRole = require("../middleware/authRole.js")
const {
  deleteProduct,
  postProduct,
  getFristProduct,
  putProduct,
  countProduct,
  getProducts,
  getProductsByCategory,
  filterProducts,
  filterProductsByCategory,
  getProductDetail,
  getOtherOptions,
  getSaleProducts,
  getProductsByState,
  searchProduct
} = require("../controller/productsController.js")
const inputValidation = require("../middleware/inputValidation.js")
const { productSchema } = require("../util/valideInput.js")
const productsRoute = express.Router()

productsRoute.get('/', getProducts)
productsRoute.get('/filter', authTokenFirebase, authRole('admin'), filterProducts)
productsRoute.get('/state/count/:state', countProduct)
productsRoute.get('/state/:state', getProductsByState)
productsRoute.get('/sales', getSaleProducts)
productsRoute.get('/search', searchProduct)
productsRoute.get("/:category", getProductsByCategory)
productsRoute.get('/:category/filter/:options', filterProductsByCategory)
productsRoute.get('/detail/:id/', getProductDetail)
productsRoute.get('/other_options/:model', getOtherOptions)
productsRoute.get('/first/:category', getFristProduct)
productsRoute.put('/', inputValidation(productSchema, 'body'), authTokenFirebase, authRole('admin'), putProduct)
productsRoute.post('/manage', inputValidation(productSchema, 'body'), authTokenFirebase, authRole('admin'), postProduct)
productsRoute.delete('/manage/:id', deleteProduct)

module.exports = productsRoute