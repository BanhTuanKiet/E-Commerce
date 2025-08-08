import mongoose from "mongoose"
import Review from "../model/reviewsModel.js"

const itemsPerPage = 10

export const findReviewByReviewId = async (reviewId) => {
  return await Review.findById(reviewId).populate('productId').populate('userId').populate('orderId')
}

export const findReviewById = async (user, orderId, productId) => {
  return await Review.findOne({
    userId: user._id,
    orderId: orderId,
    productId: productId
  })
}

export const findReviews = async () => {
  return await Review.find().populate('productId').populate('userId')
}

export const addReview = async (userId, review, orderId, productId) => {
  return await Review.create({
    orderId,
    productId,
    userId,
    rating: review.rating,
    content: review.content
  })
}

export const updateReview = async (reviewId, reviewData) => {
  return await Review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        rating: reviewData.rating,
        content: reviewData.content,
        updatedAt: Date.now()
      }
    },
    { new: true }
  )
}

export const findReviewsByProductId = async (productId) => {
  return await Review.find({ productId: new mongoose.Types.ObjectId(productId) })
}

export const saveReply = async (reviewId, adminId, content) => {
  return await Review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        'reply.content': content,
        'reply.repliedAt': new Date(),
        'reply.adminId': adminId
      }
    },
    { new: true }
  )
}

export const getFilterReviews = async (options, page) => {
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