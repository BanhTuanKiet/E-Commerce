import { Star, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react"
import { Button, Badge, Form, ProgressBar, Image, Card, Row, Col } from "react-bootstrap"
import { renderStars } from "../../util/BadgeUtil"
import axios from '../../util/AxiosConfig'

export default function ProductReviews({ product, reviews, rating }) {
  const handleVoteReview = async (reviewId, status) => {
    try {
      await axios.put(`/reviews/vote/${reviewId}`, { status: status })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container py-4 bg-white rounded">
      <div className="mb-4">
        <h2 className="fw-bold">Đánh giá sản phẩm</h2>
        <p className="text-muted">
          Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định tốt hơn
        </p>
      </div>

      <Row className="bg-light p-4 rounded mb-4">
        <Col md={6} className="text-center">
          <div className="display-4 fw-bold">{product?.avgScore}</div>
          <div className="d-flex justify-content-center my-2">
            {renderStars(Math.round(parseFloat(product?.avgScore)))}
          </div>
          <p className="text-muted mt-2">{product?.reviews} review{product?.reviews > 1 ? "s" : ""}</p>
        </Col>


        <Col md={6}>
          {rating && Object?.entries(rating)?.reverse()?.map(([key, value]) => (
            <div key={key} className="d-flex align-items-center mb-2 gap-2">
              <div className="d-flex align-items-center" style={{ width: 50 }}>
                <span className="small">{key}</span>
                <Star size={12} className="text-warning" fill="#facc15" />
              </div>
              <ProgressBar now={value / product?.reviews * 100} className="flex-grow-1" />
              <span className="small text-muted" style={{ width: 30 }}>
                {value}
              </span>
            </div>
          ))}
        </Col>
      </Row>

      {reviews?.map((review) => (
        <Card key={review?._id} className="mb-3">
          <Card.Body>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-2">
                <strong>
                  {review.isVisible ? review.userId.name : "Anonymous user"}
                </strong>
                {!review.isFlagged ? (
                  <Badge bg="success" className="small">Verified</Badge>
                ) : (
                  <Badge bg="danger" className="small">Unverified</Badge>
                )}
                <span className="text-muted small">
                  {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                {renderStars(review.rating)}
              </div>

              {/* Hiển thị content theo role */}
              {review?.content?.map((reply, idx) => (
                <div
                  key={idx}
                  className={`p-3 bg-primary bg-opacity-10 rounded mb-3 w-75 ${reply.role === "admin" ? "ms-auto text-end" : ""}`}
                >
                  <div
                    className={`d-flex align-items-center gap-2 mb-2 ${reply.role === "admin" ? "flex-row-reverse" : ""}`}
                  >
                    <span className="fw-medium">{reply.role}</span>
                    <span className="small text-muted">
                      {new Date(reply.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-dark mb-0">{reply.content}</p>
                </div>
              ))}

              <div className="d-flex gap-3">
                <Button
                  variant="link"
                  className="p-0 text-secondary text-decoration-none"
                  onClick={() => handleVoteReview(review?._id, true)}
                >
                  <ThumbsUp size={16} className="me-1 text-primary" />
                  Helpful (
                  {review?.isHelpfulCount
                    ? review?.isHelpfulCount.filter(r => r.status === true).length
                    : 0}
                  )
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-secondary text-decoration-none"
                  onClick={() => handleVoteReview(review?._id, false)}
                >
                  <ThumbsDown size={16} className="me-1 text-danger" />
                  Not helpful (
                  {review?.isHelpfulCount
                    ? review?.isHelpfulCount.filter(r => r.status === false).length
                    : 0}
                  )
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      <div className="text-center my-4">
        <Button variant="outline-secondary" size="lg">
          See more
          <ChevronDown size={16} className="ms-2" />
        </Button>
      </div>

      <div className="p-4 bg-primary bg-opacity-10 rounded text-center">
        <h5>Did you buy this product?</h5>
        <p className="text-muted">Share your experience to help other buyers</p>
        <Button variant="primary">Write a review</Button>
      </div>
    </div >
  )
}
