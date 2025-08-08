import expres from "express"
import authToken from '../middleware/authToken.js'
import { authRole } from '../middleware/authRole.js'
import { getVoucher, getVoucherByCode, putVoucherStatus, putVoucher, filterVouchers } from "../controller/vouchersController.js"
const vouchersRoute = expres.Router()

vouchersRoute.get('/', getVoucher)
vouchersRoute.get('/filter', authToken, authRole('admin'), filterVouchers)
vouchersRoute.get('/:voucherCode', getVoucherByCode)
vouchersRoute.put('/', authToken, authRole('admin'), putVoucher)
vouchersRoute.put('/status/:voucherId', authToken, authRole('admin'), putVoucherStatus)

export default vouchersRoute