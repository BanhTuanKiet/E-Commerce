import mongoose from "mongoose"
import { getProductById } from "../service/productsService.js"
import { findReviews, findReviewById, addReview, updateReview, findReviewsByProductId, saveReply, getFilterReviews, findReviewByReviewId } from "../service/reviewsService.js"
import ErrorException from "../util/error.js"

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

    const review = await findReviewById(user, orderId, productId)

    if (review === null) {
      return res.json({ state: false })
    }

    return res.json({ data: review, state: true })
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user } = req;
    const { review, orderId, productId } = req.body;

    if (!review || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
      throw new ErrorException(400, "Rating must be between 1 and 5!");
    }

    const product = await getProductById(productId, session);
    if (!product) {
      throw new ErrorException(404, "Product not found!");
    }

    product.$session(session);

    const existingReview = await findReviewById(user, orderId, productId, session);

    if (!existingReview) {
      await addReview(user._id, review, orderId, productId, session);

      const totalScore = product.avgScore * product.reviews + review.rating;
      const totalReviews = product.reviews + 1;
      const newAvg = parseFloat((totalScore / totalReviews).toFixed(1));

      product.avgScore = newAvg;
      product.reviews = totalReviews;

      await product.save({ session });

      await session.commitTransaction();
      return res.json({ message: "Review submitted successfully!" });
    }

    if (existingReview.rating !== review.rating) {
      const totalScore = product.avgScore * product.reviews - existingReview.rating + review.rating;
      const newAvg = parseFloat((totalScore / product.reviews).toFixed(1));
      product.avgScore = newAvg;
      await product.save({ session });
    }

    await updateReview(existingReview._id, review, session);

    await session.commitTransaction();
    return res.json({ message: "Review updated successfully!" });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
}

export const getRating = async (req, res, next) => {
  try {
    const { productId } = req.params
    const reviews = await findReviewsByProductId(productId)

    if (reviews.length === 0) {
      return res.json({ totalReviews: 0 })
    }

    const scores = reviews.map(r => r.rating)
    const totalScore = scores.reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / scores.length

    return res.json({ averageRating: Number(averageScore.toFixed(1)), totalReviews: reviews.length })
  } catch (error) {
    next(error)
  }
}

export const replyReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reviewId, reply } = req.body
    const { _id } = req.user

    const savedReply = await saveReply(reviewId, _id, reply)

    if (!savedReply) throw new ErrorException(400, "Reply failed")
    await session.commitTransaction();
    return res.json({ message: "Replied successful" })
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
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