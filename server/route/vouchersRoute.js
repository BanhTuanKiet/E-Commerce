const express = require("express")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const authRole = require("../middleware/authRole.js")
const { postVoucher, getVoucher, getVoucherByCode, putVoucherStatus, putVoucher, filterVouchers, removeVoucher } = require("../controller/vouchersController.js")
const inputValidation = require("../middleware/inputValidation.js")
const { voucherSchema } = require("../util/valideInput.js")
const vouchersRoute = express.Router()

vouchersRoute.get('/', authTokenFirebase, getVoucher)
vouchersRoute.post('/', authTokenFirebase, authRole('admin'), inputValidation(voucherSchema, 'body'), postVoucher)
vouchersRoute.get('/filter', authTokenFirebase, authRole('admin'), filterVouchers)
vouchersRoute.get('/:voucherCode', getVoucherByCode)
vouchersRoute.put('/', authTokenFirebase, authRole('admin'), putVoucher)
vouchersRoute.put('/status/:voucherId', authTokenFirebase, authRole('admin'), putVoucherStatus)
vouchersRoute.delete('/:voucherId', authTokenFirebase, authRole('admin'), removeVoucher)

module.exports = vouchersRoute