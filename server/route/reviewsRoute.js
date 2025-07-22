import expres from "express"
import { getReview, postReview } from "../controller/reviewsController.js"
import authToken from "../middleware/authToken.js"
const reviewsRoute = expres.Router()

reviewsRoute.use(authToken)

reviewsRoute.get(`/:orderId/:productId`, getReview)
reviewsRoute.post(`/`, postReview)

export default reviewsRoute