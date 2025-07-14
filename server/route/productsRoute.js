import expres from "express"
import { getProducts, filterProducts, getProductDetail, getOtherOptions, getSaleProducts, getProductsByState } from "../controller/productsController.js"
const productsRoute = expres.Router()

productsRoute.get('/state/:state', getProductsByState)
productsRoute.get('/sales', getSaleProducts)
productsRoute.get("/:category", getProducts)
productsRoute.get('/:category/filter/:options', filterProducts)
productsRoute.get('/:category/:id/detail', getProductDetail)
productsRoute.get('/:category/:model/other_options', getOtherOptions)

export default productsRoute