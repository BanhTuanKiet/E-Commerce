import expres from "express"
import authToken from '../middleware/authToken.js'
import authTokenFirebase from "../middleware/authTokenFirebase.js"
import { authRole } from '../middleware/authRole.js'
import { postVoucher, getVoucher, getVoucherByCode, putVoucherStatus, putVoucher, filterVouchers, removeVoucher } from "../controller/vouchersController.js"
import { inputValidation } from "../middleware/inputValidation.js"
import { voucherSchema } from "../util/valideInput.js"
const vouchersRoute = expres.Router()

vouchersRoute.get('/', getVoucher)
vouchersRoute.post('/', authTokenFirebase, authRole('admin'), inputValidation(voucherSchema, 'body'), postVoucher)
vouchersRoute.get('/filter', authTokenFirebase, authRole('admin'), filterVouchers)
vouchersRoute.get('/:voucherCode', getVoucherByCode)
vouchersRoute.put('/', authTokenFirebase, authRole('admin'), putVoucher)
vouchersRoute.put('/status/:voucherId', authTokenFirebase, authRole('admin'), putVoucherStatus)
vouchersRoute.delete('/:voucherId', authTokenFirebase, authRole('admin'), removeVoucher)

export default vouchersRoute