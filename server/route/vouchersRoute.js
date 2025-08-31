const express = require("express")
const { 
  postVoucher, 
  getVoucher, 
  getVoucherByCode, 
  putVoucherStatus, 
  putVoucher, 
  filterVouchers, 
  removeVoucher 
} = require("../controller/vouchersController.js")
const inputValidation = require("../middleware/inputValidation.js")
const { voucherSchema } = require("../util/valideInput.js")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')

const vouchersRoute = express.Router()

vouchersRoute.get(
  '/', 
  authTokenFirebase, 
  authAccountActive, 
  getVoucher
)

vouchersRoute.post(
  '/', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  inputValidation(voucherSchema, 'body'), 
  postVoucher
)

vouchersRoute.get(
  '/filter', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  filterVouchers
)

vouchersRoute.get('/:voucherCode', getVoucherByCode)

vouchersRoute.put(
  '/', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  putVoucher
)

vouchersRoute.put(
  '/status/:voucherId', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  putVoucherStatus
)

vouchersRoute.delete(
  '/:voucherId', 
  authTokenFirebase, 
  authRole('admin'), 
  authAccountActive, 
  removeVoucher
)

module.exports = vouchersRoute
