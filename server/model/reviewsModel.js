import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  reply: {
    content: { type: String, trim: true },
    repliedAt: { type: Date },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  isVisible: {
    type: Boolean,
    default: true // có thể dùng để ẩn review nếu vi phạm chính sách
  },
  isFlagged: { type: Boolean, default: false },
}, { 
  timestamps: true,
  collection: "Reviews" 
})

const Review = mongoose.model('Review', reviewSchema)
export default Review