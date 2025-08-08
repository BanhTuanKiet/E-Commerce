import mongoose from "mongoose"
import { updateVoucher, findVouchers, findVoucherByCode, findVoucherId, updateVoucherStatus, getFilterVouchers  } from "../service/vouchersService.js"
import ErrorException from "../Util/error.js"
import { voucherSchema } from "../util/valideInput.js"

export const getVoucher = async (req, res, next) => {
  try {
    const vouchers = await findVouchers()

    return res.json({ data: vouchers })
  } catch (error) {
    next(error)
  }
}

export const getVoucherByCode = async (req, res, next) => {
  try {
    const { voucherCode } = req.params

    const voucher = await findVoucherByCode(voucherCode)

    return res.json({ data: voucher })
  } catch (error) {
    next(error)
  }
}

export const putVoucher = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { voucher } = req.body

    const originalVoucher = await findVoucherId(voucher)

    if (!originalVoucher) throw new ErrorException(404, "Voucher not found")

    const { error } = voucherSchema.validate(voucher, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((err) => err.message)
      throw new ErrorException(400, errorMessages.join(', '))
    }

    const updatedVoucher = await updateVoucher(voucher, session)

    if (!updatedVoucher) throw new Error(400, "Update voucher failed")

    return res.json({ message: "Update voucher successful" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const putVoucherStatus = async (req, res, next) => {
  const session = await new mongoose.startSession()
  session.startTransaction()

  try {
    const { voucherId } = req.params

    const voucher = await findVoucherId(voucherId)

    if (!voucher) throw new ErrorException(404, "Voucher not found")

    const updatedVoucher = await updateVoucherStatus(voucher)
    console.log(updatedVoucher.isActive)
    const isActive = updatedVoucher.isActive ? "actived" : "paused"
    return res.json({ message: `Voucher is ${isActive}` })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const filterVouchers = async (req, res, next) => {
  const session = await new mongoose.startSession()
  session.startTransaction()

  try {
    let { options, page } = req.query

    if (!page) page = 1

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { vouchers, totalPages } = await getFilterVouchers(decodedOptions, page)

    if (!Array.isArray(vouchers) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid voucher list")

    return res.json({ data: vouchers, totalPages: totalPages })

  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}