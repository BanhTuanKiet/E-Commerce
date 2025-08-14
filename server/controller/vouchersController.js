import mongoose from "mongoose"
import { addVoucher, updateVoucher, findVouchers, findVoucherByCode, findVoucherId, updateVoucherStatus, getFilterVouchers, deleteVoucher } from "../service/vouchersService.js"
import ErrorException from "../Util/errorException.js"
import { newVoucherSchema, voucherSchema } from "../util/valideInput.js"

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

    if (!voucherCode || voucherCode.trim() === "") {
      throw new ErrorException(400, "Code cannot be empty")
    }

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

    if (!voucher || Object.keys(voucher).length === 0) {
      throw new ErrorException(400, "Voucher data is required")
    }

    const originalVoucher = await findVoucherId(voucher)

    if (!originalVoucher) throw new ErrorException(404, "Voucher not found")

    const { error } = voucherSchema.validate(voucher, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((err) => err.message)
      throw new ErrorException(400, errorMessages.join(', '))
    }

    const updatedVoucher = await updateVoucher(voucher, session)

    if (!updatedVoucher) throw new ErrorException(400, "Update voucher failed")

    return res.json({ message: "Update voucher successful" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const putVoucherStatus = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { voucherId } = req.params

    const voucher = await findVoucherId(voucherId)

    if (!voucher) throw new ErrorException(404, "Voucher not found")

    const updatedVoucher = await updateVoucherStatus(voucher)

    const isActive = updatedVoucher.isActive ? "actived" : "paused"
    await session.commitTransaction()

    return res.json({ message: `Voucher is ${isActive}` })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const filterVouchers = async (req, res, next) => {
  try {
    let { options, page } = req.query

    if (!page) page = 1

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { vouchers, totalPages } = await getFilterVouchers(decodedOptions, page)

    if (!Array.isArray(vouchers) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid voucher list")

    return res.json({ data: vouchers, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

export const postVoucher = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { voucher } = req.body

    if (!voucher || Object.keys(voucher).length === 0) {
      throw new ErrorException(400, "Voucher data is required")
    }

    const { error } = newVoucherSchema.validate(voucher, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((err) => err.message)
      throw new ErrorException(400, errorMessages.join(', '))
    }

    const addedVoucher = await addVoucher(voucher, session)

    if (!addedVoucher) throw new ErrorException(400, "Add voucher failed")

    await session.commitTransaction()

    return res.json({ message: "Add voucher successful" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const removeVoucher = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { voucherId } = req.params

    const voucher = await findVoucherId(voucherId)

    if (!voucher) throw new ErrorException(404, 'Voucher not found')

    if (voucher.used > 0) throw new ErrorException(400, "This voucher has already been used and cannot be deleted. You can only pause it instead.")

    voucher.$session(session)
    const voucherDeleted = await deleteVoucher(voucher)

    if (!voucherDeleted.deletedCount) throw new ErrorException(400, "Delete failed")

    await session.commitTransaction()
    return res.json({ message: "Voucher was deleted" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}