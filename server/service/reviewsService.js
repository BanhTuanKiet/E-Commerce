import mongoose from "mongoose"
import Review from "../model/reviewsModel.js"

const itemsPerPage = 10

export const findReview = async (reviewId) => {
  return await Review.findById(reviewId)
}

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
    content: {
      content: review.content,
      role: "customer",
      _id: userId
    }
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

export const findReviewsCustomerByProductId = async (productId) => {
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

export const saveReply = async (reviewId, user, content, session) => {
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

export const firstVote = async (reviewId, userId, status, session) => {
  return await Review.findOneAndUpdate(
    { _id: reviewId }, // ✅ đúng filter
    { $push: { isHelpfulCount: { userId, status } } },
    { new: true, session }
  )
}

export const removeVote = async (reviewId, userId, session) => {
  return await Review.findOneAndUpdate(
    { _id: reviewId },
    { $pull: { isHelpfulCount: { userId } } },
    { new: true, session }
  )
}

export const changeVote = async (review, target, userId, session) => {
  return await Review.findOneAndUpdate(
    { _id: review._id, "isHelpfulCount.userId": userId },
    { $set: { "isHelpfulCount.$.status": !target.status } },
    { new: true, session }
  )
}
