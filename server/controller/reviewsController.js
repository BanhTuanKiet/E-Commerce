import mongoose from "mongoose"
import { getProductById, updateReviewProduct } from "../service/productsService.js"
import { findReviews, findReviewById, addReview, updateReview, findReviewsByProductId, saveReply, getFilterReviews, findReviewByReviewId, findReviewsCustomerByProductId, findReview, firstVote, removeVote, changeVote } from "../service/reviewsService.js"
import ErrorException from "../util/errorException.js"
import { findOrderById } from "../service/orderServcie.js"
import { getProductImage } from "../util/getProductImage.js"
import { sendMessage } from "../config/webSocket.js"

export const getReviewByReviewId = async (req, res, next) => {
  try {
    const { reviewId } = req.params

    const review = await findReviewByReviewId(reviewId)

    if (!review) throw new ErrorException(404, "Review not found!")

    return res.json({ data: review })
  } catch (error) {
    next(error)
  }
}

export const getReview = async (req, res, next) => {
  try {
    const { user } = req

    const { orderId, productId } = req.params

    if (!orderId || !productId) throw new ErrorException(500, "Missing orderId or productId")

    const review = await findReviewById(user, orderId, productId)

    if (!review) {
      return res.json({ state: false })
    }

    return res.json({ data: review, state: true })
  } catch (error) {
    next(error)
  }
}

export const getReviewByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params

    const reviews = await findReviewsCustomerByProductId(productId)

    if (!reviews || reviews.length === 0) return

    const visibleReview = reviews.map(review => {
      const reviewObj = review.toObject()

      reviewObj.productId.images = getProductImage(reviewObj.productId.images)

      return {
        ...reviewObj,
        userId: review.isVisible ? review.userId : review.userId._id
      }
    })

    return res.json({ data: visibleReview })
  } catch (error) {
    next(error)
  }
}

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await findReviews()

    if (!Array.isArray(reviews)) throw new ErrorException(400, "Invalid review list")

    return res.json({ data: reviews })
  } catch (error) {
    next(error)
  }
}

export const postReview = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { user } = req
    const { review, orderId, productId } = req.body

    if (!review || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
      throw new ErrorException(400, "Rating must be between 1 and 5!")
    }

    const order = await findOrderById(orderId)

    if (!order) throw new ErrorException(404, "Order of product not found")

    if (order.customerId._id.toString() !== user._id) throw new ErrorException(400, "Only owner order can review!")

    const product = await getProductById(productId, session)
    if (!product) throw new ErrorException(404, "Product not found!")

    product.$session(session)

    const existingReview = await findReviewById(user, orderId, productId, session)

    let totalScore = product.avgScore * product.reviews
    let totalReviews = product.reviews
    let newAvg = product.avgScore

    if (!existingReview) {
      await addReview(user._id, review, orderId, productId, session)
      totalScore += review.rating
      totalReviews += 1
      newAvg = parseFloat((totalScore / totalReviews).toFixed(1))

      await updateReviewProduct(product._id, newAvg, totalReviews, session)
    }
    else if (existingReview.rating !== review.rating) {
      totalScore = totalScore - existingReview.rating + review.rating
      newAvg = parseFloat((totalScore / totalReviews).toFixed(1))

      await updateReview(existingReview._id, review, session)
      await updateReviewProduct(product._id, newAvg, totalReviews, session)
    }

    await session.commitTransaction()
    return res.json({ message: "Review submitted successfully!" })

  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const getRating = async (req, res, next) => {
  try {
    const { productId } = req.params
    const reviews = await findReviewsByProductId(productId)

    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 })
    }

    const scores = reviews.map(r => r.rating)
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / scores.length

    return res.json({ averageRating: Number(averageScore.toFixed(1)), totalReviews: reviews.length })
  } catch (error) {
    next(error)
  }
}

export const getDetailRating = async (req, res, next) => {
  try {
    const { productId } = req.params

    const reviews = await findReviewsByProductId(productId)

    const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    if (reviews.length === 0) {
      return res.json({ data: ratingCount })
    }

    reviews.forEach(review => {
      ratingCount[review.rating]++
    })

    return res.json({ data: ratingCount })
  } catch (error) {
    next(error)
  }
}

export const replyReview = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { reviewId, content } = req.body
    const { user } = req
    console.log(user, reviewId, content)
    const savedReply = await saveReply(reviewId, user, content, session)
    if (!savedReply) throw new ErrorException(400, "Reply failed")

    const contentLength = savedReply.content.length
    const newMessage = savedReply.content[contentLength - 1].toObject()

    delete newMessage._id
    sendMessage(newMessage)

    await session.commitTransaction()
    return res.json({ message: "Replied successful" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const filterReviews = async (req, res, next) => {
  try {
    const { options, page } = req.query
    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { reviews, totalPages } = await getFilterReviews(decodedOptions, page)

    if (!Array.isArray(reviews) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid review list")

    return res.json({ data: reviews, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

export const voteReview = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { user } = req
    const { status } = req.body
    const { reviewId } = req.params
    const userId = user._id.toString()

    const review = await findReview(reviewId)

    if (!review) {
      throw new ErrorException(500, "Review not found")
    }

    review.$session(session)

    const hasVoted = review.isHelpfulCount.find(
      vote => vote.userId.toString() === userId
    )

    let votedReview = null

    if (!hasVoted) {
      votedReview = await firstVote(review._id, user._id, status, session)

      if (!votedReview) throw new ErrorException(400, "Vote review failed")

      await session.commitTransaction()
      return res.json({ message: "Voted" })
    }

    if (hasVoted.status === status) {
      votedReview = await removeVote(review._id, user._id, session)

      if (!votedReview) throw new ErrorException(400, "Remove vote review failed")
      await session.commitTransaction()
      return res.json({ message: "Removed" })
    }

    const target = review.isHelpfulCount.find(v => v.userId.toString() === userId.toString())

    votedReview = await changeVote(review, target, user._id, session)

    if (!votedReview) throw new ErrorException(400, "Change vote review failed")

    await session.commitTransaction()
    return res.json({ message: "Changed" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}