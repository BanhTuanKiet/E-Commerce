import { findVouchers, findVoucherByCode } from "../service/vouchersService.js"

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