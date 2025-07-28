import expres from "express"
import { countProduct, getProducts, getProductsByCategory, filterProducts, filterProductsByCategory, getProductDetail, getOtherOptions, getSaleProducts, getProductsByState } from "../controller/productsController.js"
const productsRoute = expres.Router()

productsRoute.get('/', getProducts)
productsRoute.get('/filter/:options', filterProducts)
productsRoute.get('/state/count/:state', countProduct)
productsRoute.get('/state/:state', getProductsByState)
productsRoute.get('/sales', getSaleProducts)
productsRoute.get("/:category", getProductsByCategory)
productsRoute.get('/:category/filter/:options', filterProductsByCategory)
productsRoute.get('/detail/:id/', getProductDetail)
productsRoute.get('/other_options/:model', getOtherOptions)

export default productsRoute