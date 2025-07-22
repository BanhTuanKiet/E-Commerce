import mongoose from 'mongoose'

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
        //   type: mongoose.Schema.Types.ObjectId,
        type: String,
          ref: 'Phones',
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
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },

    note: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Orders', orderSchema, 'Orders')