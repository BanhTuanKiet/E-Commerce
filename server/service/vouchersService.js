import vouchers from "../model/vouchersModel.js"

export const findVouchers = async () => {
    return await vouchers.find()
}

export const findVoucherByCode = async (voucherCode) => {
    return await vouchers.findOne({ code: { $regex: `^${voucherCode}$`, $options: 'i' } })
}