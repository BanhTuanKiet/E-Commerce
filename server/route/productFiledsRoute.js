import expres from "express"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from "../middleware/authTokenFirebase.js"
import { getProductFields } from '../controller/productFieldsController.js'
const productFieldsRoute = expres.Router()

productFieldsRoute.use(authTokenFirebase)

productFieldsRoute.get('/:type', getProductFields)

export default productFieldsRoute