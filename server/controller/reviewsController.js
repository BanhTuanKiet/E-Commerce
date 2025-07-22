import { findReviewById, addReview, updateReview } from "../service/reviewsService.js"

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

        const existingReview = await findReviewById(user, orderId, productId)

        if (existingReview === null) {
            await addReview(user._id, review, orderId, productId)

            return res.json({ message: "Review successful! " })
        }

        await updateReview(existingReview._id, review)

        return res.json({ message: "Review updated!" })
    } catch (error) {
        next(error)
    }
}