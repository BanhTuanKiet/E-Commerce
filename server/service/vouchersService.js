import vouchers from "../model/vouchersModel.js"

export const findVouchers = async () => {
    return await vouchers.find()
}