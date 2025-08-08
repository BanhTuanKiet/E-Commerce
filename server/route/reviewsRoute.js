import expres from "express"
import { replyReview, getReview, getReviews, postReview, getRating, filterReviews, getReviewByReviewId } from "../controller/reviewsController.js"
import authToken from "../middleware/authToken.js"
import { authRole } from "../middleware/authRole.js"
const reviewsRoute = expres.Router()

reviewsRoute.use(authToken)

reviewsRoute.post(`/`, postReview)
reviewsRoute.get('/', getReviews)
reviewsRoute.post('/reply', authRole('admin'), replyReview)
reviewsRoute.get('/filter', authRole('admin'), filterReviews)
reviewsRoute.get('/rating/:productId', getRating)
reviewsRoute.get('/detail/:reviewId', authRole('admin'), getReviewByReviewId)
reviewsRoute.get(`/:orderId/:productId`, getReview)

export default reviewsRoute