import { getProductById } from "../service/productsService.js"
import { findReviewById, addReview, updateReview, findReviewsByProductId } from "../service/reviewsService.js"

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

export const postReview = async (req, res, next) => {
    try {
        const { user } = req
        const { review, orderId, productId } = req.body

        const product = await getProductById(productId)
        const existingReview = await findReviewById(user, orderId, productId)

        if (existingReview === null) {
            await addReview(user._id, review, orderId, productId)
            product.reviews++
            await product.save()

            return res.json({ message: "Review successful! " })
        }

        await updateReview(existingReview._id, review)

        return res.json({ message: "Review updated!" })
    } catch (error) {
        next(error)
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

        return res.json({ averageRating: Number(averageScore.toFixed(1)),  totalReviews: reviews.length })
    } catch (error) {
        next(error)
    }
}