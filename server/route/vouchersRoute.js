import expres from "express"
import { getVoucher, getVoucherByCode } from "../controller/vouchersController.js"
const vouchersRoute = expres.Router()

vouchersRoute.get('/', getVoucher)
vouchersRoute.get('/:voucherCode', getVoucherByCode)

export default vouchersRoute