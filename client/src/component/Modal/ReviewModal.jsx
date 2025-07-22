import axios from '../../util/AxiosConfig'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import { Modal, Button, Form, Card } from 'react-bootstrap'
import { FaStar } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

function ReviewModal({ showReviewModal, setShowReviewModal, selectedProduct }) {
    const { orderId } = useParams()
    const [review, setReview] = useState({
        rating: 0,
        content: ""
    })
    const [isReviewed, setIsReviewed] = useState(false)
    const timeoutReview = useRef(null)
    const scoreMap = {
        1: "Very bad",
        2: "Bad",
        3: "Okay",
        4: "Good",
        5: "Very good"
    }

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await axios.get(`/reviews/${orderId}/${selectedProduct?.productId?._id}`)
                setIsReviewed(response.state)
                if (!response.state) {
                    setIsReviewed(false)
                } else {
                    setIsReviewed(true)
                    setReview(prev => ({
                        ...prev,
                        rating: response.data.rating,
                        content: response.data.content
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (selectedProduct) {
            fetchReview()
        }
    }, [selectedProduct])

    const handleStarClick = (ratingValue) => {
        setReview(prev => ({ ...prev, rating: ratingValue }))
    }

    const handleReview = (e) => {
        setReview({ ...review, [e.target.name]: e.target.value })
    }

    const handleAddSuggestion = (text) => {
        setReview(prev => ({
            ...prev,
            content: prev.content
                ? prev.content.trim().endsWith('.')
                    ? prev.content + ' ' + text
                    : prev.content + '. ' + text
                : text
        }))
    }

    const sendReview = () => {
        if (timeoutReview.current) {
            clearTimeout(timeoutReview.current)
        }

        if (isReviewed) {
            const confirmUpdate = window.confirm("You have already rated this product. Do you want to update your review?")
            if (!confirmUpdate) return
        }

        timeoutReview.current = setTimeout(async () => {
            try {
                await axios.post(`/reviews`, { review: review, orderId: orderId, productId: selectedProduct?.productId?._id })
            } catch (error) {
                console.log(error)
            }
        }, 500)
    }

    return (
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
            <Modal.Header closeButton >
                <Modal.Title className=''>Product review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card.Img
                    variant="top"
                    src={selectedProduct?.productId?.images[0] || ""}
                    alt={selectedProduct?.productId?.model}
                    className='object-fit-contain p-1'
                    style={{
                        height: '120px',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                    }}
                />
                <p className="fw-bold text-center">{selectedProduct?.productId?.model}</p>

                <Form.Group className="mb-3 text-center">
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={24}
                                className="me-1"
                                style={{ cursor: 'pointer' }}
                                color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                                onClick={() => handleStarClick(star)}
                            />
                        ))}
                    </div>
                </Form.Group>

                <p className="text-muted text-center">{scoreMap[review.rating]}</p>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Suggest:
                        {["Sản phẩm tốt", "Giao hàng nhanh", "Đóng gói cẩn thận", "SSSSSSSSSS"].map((item, index) => (
                            <span
                                onClick={() => handleAddSuggestion("Sản phẩm đúng như mô tả")}
                                className="text-primary ms-2 border rounded-pill p-2"
                                style={{ cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                            >
                                {item}
                            </span>
                        ))
                        }
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        name='content'
                        rows={4}
                        value={review.content}
                        onChange={handleReview}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendReview}>
                    {isReviewed ? "Update" : "Review"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReviewModal
