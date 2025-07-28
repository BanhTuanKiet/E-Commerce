import mongoose from "mongoose"
import reviews from "../model/reviewsModel.js"

export const findReviewById = async (user, orderId, productId) => {
    return await reviews.findOne({
        userId: user._id,
        orderId: orderId,
        productId: productId
    })
}

export const addReview = async (userId, review, orderId, productId) => {
    return await reviews.create({
        orderId,
        productId,
        userId,
        rating: review.rating,
        content: review.content
    })
}

export const updateReview = async (reviewId, reviewData) => {
    return await reviews.findByIdAndUpdate(
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
    return await reviews.find({ productId: new mongoose.Types.ObjectId(productId) })
}