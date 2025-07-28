import expres from "express"
import { getReview, postReview, getRating } from "../controller/reviewsController.js"
import authToken from "../middleware/authToken.js"
const reviewsRoute = expres.Router()

reviewsRoute.use(authToken)

reviewsRoute.post(`/`, postReview)
reviewsRoute.get('/rating/:productId', getRating)
reviewsRoute.get(`/:orderId/:productId`, getReview)

export default reviewsRoute