import expres from "express"
import { voteReview, getDetailRating, getReviewByProductId, replyReview, getReview, getReviews, postReview, getRating, filterReviews, getReviewByReviewId } from "../controller/reviewsController.js"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from "../middleware/authTokenFirebase.js"
import { authRole } from "../middleware/authRole.js"
import { inputValidation } from "../middleware/inputValidation.js"
import { newReview } from "../util/valideInput.js"
const reviewsRoute = expres.Router()

reviewsRoute.post(`/`, inputValidation(newReview, 'body'), authTokenFirebase, postReview)
reviewsRoute.get('/', authTokenFirebase, getReviews)
reviewsRoute.put('/reply', authTokenFirebase, replyReview)
reviewsRoute.get('/filter', authTokenFirebase, authRole('admin'), filterReviews)
reviewsRoute.get('/rating/:productId', getRating)
reviewsRoute.get('/rating/detail/:productId', getDetailRating)
reviewsRoute.get(`/customer/:productId`, getReviewByProductId)
reviewsRoute.get('/detail/:reviewId', authTokenFirebase, authRole('admin'), getReviewByReviewId)
reviewsRoute.get(`/:orderId/:productId`, authTokenFirebase, getReview)
reviewsRoute.put('/vote/:reviewId', authTokenFirebase, voteReview)

export default reviewsRoute