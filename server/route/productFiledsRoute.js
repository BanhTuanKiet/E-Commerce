import expres from "express"
import authToken from "../middleware/authToken.js"
import { getProductFields } from '../controller/productFieldsController.js'
const productFieldsRoute = expres.Router()

productFieldsRoute.use(authToken)

productFieldsRoute.get('/', getProductFields)

export default productFieldsRoute