const express = require("express")
const { 
  voteReview, 
  getDetailRating, 
  getReviewByProductId, 
  replyReview, 
  getReview, 
  getReviews, 
  postReview, 
  getRating, 
  filterReviews, 
  getReviewByReviewId 
} = require("../controller/reviewsController.js")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')
const inputValidation = require("../middleware/inputValidation.js")
const { newReview } = require("../util/valideInput.js")

const reviewsRoute = express.Router()

reviewsRoute.post(
  '/', 
  inputValidation(newReview, 'body'), 
  authTokenFirebase, 
  authAccountActive, 
  postReview
)

reviewsRoute.get(
  '/', 
  authTokenFirebase, 
  // authAccountActive, 
  getReviews
)

reviewsRoute.put(
  '/reply', 
  authTokenFirebase, 
  authAccountActive, 
  replyReview
)

reviewsRoute.get(
  '/filter', 
  authTokenFirebase, 
  authRole('admin'), 
  // authAccountActive, 
  filterReviews
)

reviewsRoute.get('/rating/:productId', getRating)

reviewsRoute.get('/rating/detail/:productId', getDetailRating)

reviewsRoute.get('/customer/:productId', getReviewByProductId)

reviewsRoute.get(
  '/detail/:reviewId', 
  authTokenFirebase, 
  authRole('admin'), 
  // authAccountActive, 
  getReviewByReviewId
)

reviewsRoute.get(
  '/:orderId/:productId', 
  authTokenFirebase, 
  // authAccountActive, 
  getReview
)

reviewsRoute.put(
  '/vote/:reviewId', 
  authTokenFirebase, 
  authAccountActive, 
  voteReview
)

module.exports = reviewsRoute
