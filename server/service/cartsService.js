import mongoose from "mongoose";
import cartsModel from "../model/cartsModel.js"

export const getCartByCustomer = async (customerId) => {
  return await cartsModel.findOne({ customerId: customerId }).populate('items._id');
}

export const updateCartByCustomerId = async (customerId, clientCart, session) => {
  const items = clientCart.map(product => ({
    _id: product._id,
    quantity: product.quantity
  }))

  return await cartsModel.updateOne(
    { customerId: new mongoose.Types.ObjectId(customerId) },
    { $set: { items } },
    { session }
  )
}

export const addProductToCart = async (productId, customerId, session) => {
  try {
    let cart = await cartsModel.findOne({ customerId: customerId }, null, { session })

    if (!cart) {
      cart = new cartsModel({
        customerId,
        items: [{ productId: productId, quantity: 1 }]
      })
    } else {
      const existingItem = cart.items.find(item => item._id.toString() === productId.toString())

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.items.push({ _id: productId, quantity: 1 })
      }
    }

    await cart.save({ session })
    return cart
  } catch (error) {
    throw error
  }
}
