const mongoose = require('mongoose')
const Review = require('../model/reviewsModel.js')

const itemsPerPage = 10

const findReview = async (reviewId) => {
 return await Review.findById(reviewId)
}

const findReviewByReviewId = async (reviewId) => {
 return await Review.findById(reviewId).populate('productId').populate('userId').populate('orderId')
}

const findBasicReview = async (userId, orderId, productId) => {
 return await Review.findOne(
   { userId, orderId, productId },
   {
     content: { $slice: 1 }
   }
 )
}

const findReviewById = async (user, orderId, productId) => {
 return await Review.findOne({
   userId: user._id,
   orderId: orderId,
   productId: productId
 })
}

const findReviews = async () => {
 return await Review.find().populate('productId').populate('userId')
}

const addReview = async (userId, review, orderId, productId, session) => {
 return await Review.create([{
   orderId,
   productId,
   userId,
   rating: review.rating,
   content: [
     {
       content: review.content,
       role: "customer",
       _id: userId
     }
   ]
 }], { session })
}

const updateReview = async (reviewId, reviewData) => {
 return await Review.findByIdAndUpdate(
   reviewId,
   {
     $set: {
       rating: reviewData.rating,
       "content.0.content": reviewData.content,
       "content.0.createdAt": Date.now()
     }
   },
   { new: true }
 )
}

const findReviewsByProductId = async (productId) => {
 return await Review.find({ productId: new mongoose.Types.ObjectId(productId) })
}

const findReviewsCustomerByProductId = async (productId) => {
 return await Review.find({ productId: new mongoose.Types.ObjectId(productId) })
   .populate({
     path: 'userId',
     select: 'name'
   })
   .populate({
     path: 'productId',
     select: 'images'
   })
}

const saveReply = async (reviewId, user, content, session) => {
 return await Review.findByIdAndUpdate(
   reviewId,
   {
     $push: {
       content: {
         role: user.role,
         content: content,
         _id: user._id
       }
     }
   },
   { new: true, session }
 )
}

const getFilterReviews = async (options, page) => {
 const query = {}
 const skipIndex = (page - 1) * itemsPerPage

 Object.entries(options).map(([key, value]) => {
   if (key !== '' && key !== 'total' && value !== '' && value !== 'total') {
     query[key] = value
   }
 })

 const reviews = await Review.find(query).skip(skipIndex).limit(itemsPerPage).populate('productId').populate('userId')
 const totalPages = await Review.countDocuments(query)

 return {
   reviews,
   totalPages: Math.ceil(totalPages / itemsPerPage)
 }
}

const firstVote = async (reviewId, userId, status, session) => {
 return await Review.findOneAndUpdate(
   { _id: reviewId },
   { $push: { isHelpfulCount: { userId, status } } },
   { new: true, session }
 )
}

const removeVote = async (reviewId, userId, session) => {
 return await Review.findOneAndUpdate(
   { _id: reviewId },
   { $pull: { isHelpfulCount: { userId } } },
   { new: true, session }
 )
}

const changeVote = async (review, target, userId, session) => {
 return await Review.findOneAndUpdate(
   { _id: review._id, "isHelpfulCount.userId": userId },
   { $set: { "isHelpfulCount.$.status": !target.status } },
   { new: true, session }
 )
}

module.exports = {
 findReview,
 findReviewByReviewId,
 findBasicReview,
 findReviewById,
 findReviews,
 addReview,
 updateReview,
 findReviewsByProductId,
 findReviewsCustomerByProductId,
 saveReply,
 getFilterReviews,
 firstVote,
 removeVote,
 changeVote
}