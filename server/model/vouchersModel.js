import mongoose from 'mongoose'

const voucherSchema = new mongoose.Schema({
  code: {
    type: String, required: true, unique: true
  },
  description: {
    type: String, default: ''
  },
  discountType: {
    type: String, enum: ['percentage', 'fixed'], required: true
  },
  discountValue: {
    type: Number, required: true
  },
  maxDiscount: {
    type: Number, default: null
  },
  minOrderValue: {
    type: Number, default: null
  },
  quantity: {
    type: Number, required: true
  },
  usageLimitPerUser: {
    type: Number, default: 1
  },
  startDate: {
    type: Date, required: true
  },
  endDate: {
    type: Date, required: true
  },
  isActive: {
    type: Boolean, default: false
  },
  categories: {
    type: [String], default: []
  },
  used: {
    type: Number, default: 0
  },
  createdAt: { type: Date, default: Date.now() },
}, {
  timestamps: true,
  collection: 'Vouchers'
})

export default mongoose.model('Voucher', voucherSchema)