import expres from "express"
import { getVoucher } from "../controller/vouchersController.js"
const vouchersRoute = expres.Router()

vouchersRoute.get('/', getVoucher)

export default vouchersRoute