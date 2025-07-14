import cartsModel from "../model/cartsModel.js"

export const getCartByCustomer = async (customerId) => {
    return await cartsModel.findOne({ customerId: customerId }).populate('items._id');
}