import { findVouchers } from "../service/vouchersService.js"

export const getVoucher = async (req, res, next) => {
    try {
        const vouchers = await findVouchers()

        return res.json({ data: vouchers })
    } catch (error) {
        next(error)
    }
}