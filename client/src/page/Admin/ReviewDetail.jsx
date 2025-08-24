import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Form, Image, Modal, Alert } from 'react-bootstrap'
import { Copy, Phone, Mail, Star, ArrowLeft, Trash2, Flag, Check, ThumbsUp, Eye, MessageSquare, Reply, User, Package } from 'lucide-react'
import axios from '../../config/AxiosConfig'
import ReplyComponent from '../../component/ReplyComponent'
import BoxChat from '../../component/BoxChat'
import { ChatContext } from '../../context/ChatContext'

function ReviewDetail({ reviewId, setReviewId }) {
  const [review, setReview] = useState()
  const { messages, setMessages } = useContext(ChatContext)
  const [replyContent, setReplyContent] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const replyRef = useRef(null)

  useEffect(() => {
    if (!reviewId) return

    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/detail/${reviewId}`)
        setMessages(response.data.content || [])
        setReview(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReview()
  }, [reviewId, setMessages])

  const renderStars = (rating, size = "sm") => {
    const starSize = size === "lg" ? 24 : 16;

    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? <></> :
            // <StarFill key={star} size={starSize} className="text-warning me-1" /> :
            <Star key={star} size={starSize} className="text-muted me-1" />
        ))}
        <span className={`ms-2 ${size === "lg" ? "fs-5 fw-semibold" : "small fw-medium"}`}>
          {rating}
        </span>
      </div>
    );
  }

  const handleReply = () => {
    if (replyRef.current) {
      clearTimeout(replyRef.current)
    }

    replyRef.current = setTimeout(async () => {
      try {
        await axios.put(`/reviews/reply`, { reviewId: review?._id, content: replyContent })
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" size="sm" onClick={() => setReviewId()}>
                  <ArrowLeft size={16} className="me-2" />
                  Quay lại
                </Button>
                <div>
                  <h1 className="display-6 fw-bold text-dark mb-1">Chi tiết đánh giá</h1>
                  <p className="text-muted mb-0">
                    Review #{review?._id.toUpperCase()} • Created at{" "}
                    {new Date(review?.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Select style={{ width: "200px" }} >
                  <option value="">Cập nhật trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Duyệt</option>
                  <option value="rejected">Từ chối</option>
                </Form.Select>
                <Button variant="outline-warning">
                  <Flag size={16} className="me-2" />
                  Báo cáo
                </Button>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 size={16} className="me-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-primary bg-opacity-10 rounded">
                    <Star size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Đánh giá</p>
                    {renderStars(review?.rating)}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-success bg-opacity-10 rounded">
                    <Check size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Trạng thái</p>
                    {!review?.isFlagged
                      ?
                      (
                        <Badge bg="success" className="small">
                          Verified
                        </Badge>
                      )
                      :
                      (
                        <Badge bg="danger" className="small">
                          Unverified
                        </Badge>
                      )
                    }
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-info bg-opacity-10 rounded">
                    <ThumbsUp size={20} className="text-info" />
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Hữu ích</p>
                    <p className="h4 text-info fw-bold mb-0">{review?.isHelpfulCount.filter(r => r.status === false).length}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-warning bg-opacity-10 rounded">
                    <Eye size={20} className="text-warning" />
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Lượt xem</p>
                    <p className="h4 text-warning fw-bold mb-0">{review?.isHelpfulCount.length}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4">
            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                  <MessageSquare size={20} />
                  Nội dung đánh giá
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <p className="text-dark lh-lg" style={{ whiteSpace: "pre-line" }}>
                    {review?.content[0].content}
                  </p>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                  <Reply size={20} />
                  Phản hồi Admin
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <BoxChat view={'admin'} content={messages} />

                <ReplyComponent replyContent={replyContent} setReplyContent={setReplyContent} handleReply={handleReply} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                  <User size={20} />
                  Thông tin khách hàng
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="h6 mb-0">{review?.userId.name}</h3>
                  <p className="small text-muted mb-0">
                    Tham gia từ {new Date(review?.userId.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <hr />
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">Email:</span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small">{review?.userId.email}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">SĐT:</span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small">{review?.userId.phoneNumber}</span>
                      <Button variant="link" size="sm" className="p-0">
                        <Phone size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline-primary" className="w-100">
                  <Mail size={16} className="me-2" />
                  Liên hệ khách hàng
                </Button>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="d-flex align-items-center gap-2 mb-0">
                  <Package size={20} />
                  Sản phẩm được đánh giá
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Image
                    src={review?.productId.images[0]}
                    alt={review?.productId.model}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div className="flex-grow-1">
                    <h3 className="h6 mb-1">{review?.productId.model}</h3>
                    <p className="small text-muted mb-1">SKU: {review?.productId._id}</p>
                    <p className="small fw-medium text-success mb-0">
                      {review?.productId.price.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Danh mục:</span>
                    <span>{review?.productId.category}</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Thương hiệu:</span>
                    <span>{review?.productId.brand}</span>
                  </div>
                </div>
                <Button variant="outline-primary" className="w-100">
                  <Package size={16} className="me-2" />
                  Xem sản phẩm
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger">
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default ReviewDetail