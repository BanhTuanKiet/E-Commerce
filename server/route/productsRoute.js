const express = require("express")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')
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

productsRoute.get(
  '/filter', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  filterProducts
)

productsRoute.get('/state/count/:state', countProduct)

productsRoute.get('/state/:state', getProductsByState)

productsRoute.get('/sales', getSaleProducts)

productsRoute.get('/search', searchProduct)

productsRoute.get('/:category', getProductsByCategory)

productsRoute.get('/:category/filter/:options', filterProductsByCategory)

productsRoute.get('/detail/:id', getProductDetail)

productsRoute.get('/other_options/:model', getOtherOptions)

productsRoute.get('/first/:category', getFristProduct)

productsRoute.put(
  '/', 
  inputValidation(productSchema, 'body'), 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  putProduct
)

productsRoute.post(
  '/manage', 
  inputValidation(productSchema, 'body'), 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  postProduct
)

productsRoute.delete(
  '/manage/:id', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  deleteProduct
)

module.exports = productsRoute
