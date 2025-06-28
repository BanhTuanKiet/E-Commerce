import expres from "express"
import { getProducts, filterProducts, getProductDetail } from "../controller/productsController.js"
const productRoute = expres.Router()

productRoute.get("/:category", getProducts)
productRoute.get('/:category/filter/:options', filterProducts)
productRoute.get('/:category/:id/detail', getProductDetail)

export default productRoute