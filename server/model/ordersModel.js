const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
 {
   customerId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true
   },
   items: [
     {
       productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product',
         required: true
       },
       quantity: {
         type: Number,
         required: true,
         min: 1
       },
       price: {
         type: Number,
         required: true,
         min: 0
       }
     }
   ],
   subtotal: {
     type: Number,
     required: true
   },
   voucher: {
     _id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Voucher'
     },
     discountAmount: {
       type: Number,
       default: 0
     }
   },
   shippingFee: {
     type: Number,
     default: 0
   },
   totalAmount: {
     type: Number,
     required: true
   },
   paymentMethod: {
     type: String,
     enum: ['COD', 'VNPay', 'Momo'],
     default: 'COD'
   },
   paymentStatus: {
     type: String,
     enum: ['unpaid', 'paid', 'failed'],
     default: 'unpaid'
   },
   orderStatus: {
     type: String,
     enum: ['processing', 'confirmed', 'shipping', 'delivered', 'cancelled'],
     default: 'processing'
   },
   note: {
     type: String,
     default: ''
   },
   statusHistory: {
     processing: {
       createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
       updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now }
     },
     confirmed: {
       createdAt: { type: mongoose.Schema.Types.Date, default: null },
       updatedAt: { type: mongoose.Schema.Types.Date, default: null }
     },
     shipping: {
       createdAt: { type: mongoose.Schema.Types.Date, default: null },
       updatedAt: { type: mongoose.Schema.Types.Date, default: null }
     },
     delivered: {
       createdAt: { type: mongoose.Schema.Types.Date, default: null },
       updatedAt: { type: mongoose.Schema.Types.Date, default: null }
     },
     cancelled: {
       createdAt: { type: mongoose.Schema.Types.Date, default: null },
       updatedAt: { type: mongoose.Schema.Types.Date, default: null }
     }
   }
 },
 {
   timestamps: true,
   collection: 'Orders'
 }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order