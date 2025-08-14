import expres from "express"
import { voteReview, getDetailRating, getReviewByProductId, replyReview, getReview, getReviews, postReview, getRating, filterReviews, getReviewByReviewId } from "../controller/reviewsController.js"
import authToken from "../middleware/authToken.js"
import { authRole } from "../middleware/authRole.js"
const reviewsRoute = expres.Router()

reviewsRoute.post(`/`, authToken, postReview)
reviewsRoute.get('/', authToken, getReviews)
reviewsRoute.put('/reply', authToken, replyReview)
reviewsRoute.get('/filter', authToken, authRole('admin'), filterReviews)
reviewsRoute.get('/rating/:productId', getRating)
reviewsRoute.get('/rating/detail/:productId', getDetailRating)
reviewsRoute.get(`/customer/:productId`, getReviewByProductId)
reviewsRoute.get('/detail/:reviewId', authToken, authRole('admin'), getReviewByReviewId)
reviewsRoute.get(`/:orderId/:productId`, authToken, getReview)
reviewsRoute.put('/vote/:reviewId', authToken, voteReview)

export default reviewsRoute