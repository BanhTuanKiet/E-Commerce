import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Form, Image, Modal, Alert } from 'react-bootstrap'
import { Copy, Phone, Mail, Star, ArrowLeft, Trash2, Flag, Check, ThumbsUp, Eye, MessageSquare, Reply, User, Package } from 'lucide-react'
import axios from '../../util/AxiosConfig'

function ReviewDetail({ reviewId, setReviewId }) {
  const reviewDetails = {
    _id: "review1",
    customer: {
      _id: "user1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
      avatar: "/api/placeholder/80/80",
      joinDate: "2023-05-15T00:00:00Z",
      totalOrders: 12,
      totalReviews: 8,
    },
    product: {
      _id: "prod1",
      name: "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
      image: "/api/placeholder/120/120",
      sku: "IP15PM-256-TI",
      price: 29990000,
      category: "Điện thoại",
      brand: "Apple",
    },
    order: {
      _id: "674a1b2c3d4e5f6789012345",
      orderNumber: "ORD001",
      orderDate: "2024-01-20T10:30:00Z",
      totalAmount: 32000000,
      status: "delivered",
    },
    rating: 5,
    title: "Sản phẩm tuyệt vời, rất hài lòng!",
    content: "iPhone 15 Pro Max thực sự xuất sắc và vượt ngoài mong đợi của tôi. Camera 48MP chụp ảnh cực kỳ sắc nét, đặc biệt là chế độ chụp đêm. Chip A17 Pro xử lý mượt mà, không bao giờ bị lag kể cả khi chơi game nặng hay chỉnh sửa video 4K.\n\nThiết kế titan cao cấp, cầm nắm chắc chắn và sang trọng. Màn hình Super Retina XDR 6.7 inch hiển thị màu sắc rực rỡ, độ sáng cao ngay cả dưới ánh nắng mặt trời.\n\nPin kéo dài cả ngày sử dụng nặng. Sạc nhanh và sạc không dây rất tiện lợi. Đóng gói cẩn thận, giao hàng nhanh chóng. Dịch vụ khách hàng tận tình. Chắc chắn sẽ giới thiệu cho bạn bè!",
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 24,
    viewCount: 156,
    createdAt: "2024-01-25T14:30:00Z",
    updatedAt: "2024-01-25T15:00:00Z",
    statusHistory: [
      {
        status: "pending",
        timestamp: "2024-01-25T14:30:00Z",
        note: "Đánh giá được tạo",
        updatedBy: "System",
      },
      {
        status: "approved",
        timestamp: "2024-01-25T15:00:00Z",
        note: "Đánh giá đã được duyệt và công khai",
        updatedBy: "Admin",
      },
    ],
    adminReplies: [
      {
        id: "reply1",
        content: "Cảm ơn bạn đã dành thời gian đánh giá chi tiết! Chúng tôi rất vui khi bạn hài lòng với iPhone 15 Pro Max. Hy vọng sản phẩm sẽ đồng hành cùng bạn trong thời gian dài.",
        author: "Admin",
        authorRole: "Quản trị viên",
        createdAt: "2024-01-25T16:00:00Z",
      },
    ],
    interactions: {
      likes: 24,
      dislikes: 1,
      shares: 3,
      reports: 0,
    },
  };
  const [review, setReview] = useState()
  const [replyContent, setReplyContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    if (!reviewId) return

    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/detail/${reviewId}`)
        console.log(response.data)
        setReview(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReview()
  }, [reviewId])

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
  };

  const handleUpdateStatus = (newStatus) => {
    setShowAlert({
      show: true,
      message: `Cập nhật trạng thái đánh giá thành: ${newStatus}`,
      variant: "success"
    });
    setTimeout(() => setShowAlert({ show: false, message: "", variant: "success" }), 3000);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      setShowAlert({
        show: true,
        message: "Gửi phản hồi thành công!",
        variant: "success"
      });
      setReplyContent("");
      setTimeout(() => setShowAlert({ show: false, message: "", variant: "success" }), 3000);
    }
  };

  const handleDelete = () => {
    setShowAlert({
      show: true,
      message: "Xóa đánh giá thành công!",
      variant: "success"
    });
    setShowDeleteModal(false);
    setTimeout(() => setShowAlert({ show: false, message: "", variant: "success" }), 3000);
  };

  const handleFlag = () => {
    setShowAlert({
      show: true,
      message: "Báo cáo đánh giá thành công!",
      variant: "info"
    });
    setTimeout(() => setShowAlert({ show: false, message: "", variant: "success" }), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container fluid className="p-4">
        {showAlert.show && (
          <Alert variant={showAlert.variant} className="position-fixed" style={{ top: "20px", right: "20px", zIndex: 1050 }}>
            {showAlert.message}
          </Alert>
        )}

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
                    Đánh giá #{reviewDetails._id.slice(-8).toUpperCase()} • Tạo lúc{" "}
                    {new Date(reviewDetails.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Select style={{ width: "200px" }} onChange={(e) => handleUpdateStatus(e.target.value)}>
                  <option value="">Cập nhật trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Duyệt</option>
                  <option value="rejected">Từ chối</option>
                </Form.Select>
                <Button variant="outline-warning" onClick={handleFlag}>
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
                    <p className="h4 text-info fw-bold mb-0">{reviewDetails.helpfulCount}</p>
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
                    <p className="h4 text-warning fw-bold mb-0">{reviewDetails.viewCount}</p>
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
                    {review?.content}
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
                {reviewDetails.adminReplies.map((reply) => (
                  <div key={reply.id} className="p-3 bg-primary bg-opacity-10 rounded mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fw-medium">{reply.author}</span>
                      <Badge bg="secondary" className="small">
                        {reply.authorRole}
                      </Badge>
                      <span className="small text-muted">
                        {new Date(reply.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-dark mb-0">{reply.content}</p>
                  </div>
                ))}

                <div>
                  <Form.Label htmlFor="reply">Thêm phản hồi mới</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="reply"
                    rows={4}
                    placeholder="Nhập phản hồi của bạn..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="mb-3"
                  />
                  <Button variant="primary" onClick={handleReply}>
                    <Reply size={16} className="me-2" />
                    Gửi phản hồi
                  </Button>
                </div>
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
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default ReviewDetail