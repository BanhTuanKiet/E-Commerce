import expres from "express"
import authToken from "../middleware/authToken.js"
import { authRole } from '../middleware/authRole.js'
import {
  deleteProduct, postProduct, getFristProduct, putProduct, countProduct, getProducts,
  getProductsByCategory, filterProducts, filterProductsByCategory, getProductDetail, getOtherOptions,
  getSaleProducts, getProductsByState, searchProduct
} from "../controller/productsController.js"
import { inputValidation } from "../middleware/inputValidation.js"
import { productSchema } from "../util/valideInput.js"
const productsRoute = expres.Router()

productsRoute.get('/', getProducts)
productsRoute.get('/filter', authToken, authRole('admin'), filterProducts)
productsRoute.get('/state/count/:state', countProduct)
productsRoute.get('/state/:state', getProductsByState)
productsRoute.get('/sales', getSaleProducts)
productsRoute.get('/search', searchProduct)
productsRoute.get("/:category", getProductsByCategory)
productsRoute.get('/:category/filter/:options', filterProductsByCategory)
productsRoute.get('/detail/:id/', getProductDetail)
productsRoute.get('/other_options/:model', getOtherOptions)
productsRoute.get('/first/:category', getFristProduct)
productsRoute.put('/', inputValidation(productSchema, 'body'), authToken, authRole('admin'), putProduct)
productsRoute.post('/manage', authToken, authRole('admin'), inputValidation(productSchema, 'body'), postProduct)
productsRoute.delete('/manage/:id', deleteProduct)
export default productsRoute