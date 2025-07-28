import mongoose from "mongoose"

const CartItem = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1  
  }
}, { _id: false })

const carts = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: {
    type: [CartItem],
    default: []
  }
})

export default mongoose.model('Carts', carts, 'Carts')