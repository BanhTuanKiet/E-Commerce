const mongoose = require('mongoose')

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
 content: [
   {
     role: {
       type: String,
       enum: ['customer', 'admin'],
       required: true
     },
     content: {
       type: String,
       trim: true,
       maxlength: 1000,
       required: true
     },
     createdAt: {
       type: Date,
       default: Date.now
     },
     _id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     }
   }
 ],
 isVisible: {
   type: Boolean,
   default: true
 },
 isFlagged: { type: Boolean, default: false },
 battery: {
   capacity: Number,
   connector: String
 },
 isHelpfulCount: [
   {
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     status: { type: Boolean, required: true }
   }
 ]
}, {
 timestamps: true,
 collection: "Reviews"
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review