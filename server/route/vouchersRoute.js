import expres from "express"
import authToken from '../middleware/authToken.js'
import { authRole } from '../middleware/authRole.js'
import { postVoucher, getVoucher, getVoucherByCode, putVoucherStatus, putVoucher, filterVouchers, removeVoucher } from "../controller/vouchersController.js"
import { inputValidation } from "../middleware/inputValidation.js"
import { voucherSchema } from "../util/valideInput.js"
const vouchersRoute = expres.Router()

vouchersRoute.get('/', getVoucher)
vouchersRoute.post('/', authToken, authRole('admin'), inputValidation(voucherSchema, 'body'), postVoucher)
vouchersRoute.get('/filter', authToken, authRole('admin'), filterVouchers)
vouchersRoute.get('/:voucherCode', getVoucherByCode)
vouchersRoute.put('/', authToken, authRole('admin'), putVoucher)
vouchersRoute.put('/status/:voucherId', authToken, authRole('admin'), putVoucherStatus)
vouchersRoute.delete('/:voucherId', authToken, authRole('admin'), removeVoucher)

export default vouchersRoute