import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table, Badge, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { formatDate, formatLabel, toReadAble } from '../../util/DataClassify'
import axios from '../../util/AxiosConfig'
import ReviewModal from '../../component/Modal/ReviewModal'

export default function OrderDetail() {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState()

    const orderStatusMap = {
        completed: { color: '#28a745', bgColor: '#d4edda' },   // Hoàn tất
        pending: { color: '#856404', bgColor: '#fff3cd' },     // Chờ xử lý
        processing: { color: '#004085', bgColor: '#cce5ff' },  // Đang xử lý (gộp cả shipped vào đây)
        cancelled: { color: '#721c24', bgColor: '#f8d7da' }    // Đã huỷ
    }

    const paymentStatusMap = {
        paid: { color: '#155724', bgColor: '#d4edda' },        // Đã thanh toán
        unpaid: { color: '#856404', bgColor: '#fff3cd' },      // Chưa thanh toán
        failed: { color: '#721c24', bgColor: '#f8d7da' }       // Thanh toán thất bại
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/orders/detail/${orderId}`)
                setOrder(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId])

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container my-5">
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5">
                        <h5 className="text-muted">Order not found</h5>
                        <p className="text-muted mb-0">The order you're looking for doesn't exist or has been removed.</p>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    return (
        <div className="container my-5">
            <Row className="g-4">
                <Col lg={8} md={12}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                <h3 className="fw-bold mb-2">Order Summary</h3>
                                <p className="text-muted mb-0">Details of your order and items purchased.</p>
                            </div>

                            <div className="table-responsive">
                                <Table className="mb-4">
                                    <thead>
                                        <tr className="border-bottom">
                                            <th className="fw-medium text-muted border-0 pb-3 ps-0">Product</th>
                                            <th className="fw-medium text-muted border-0 pb-3 text-center">Quantity</th>
                                            <th className="fw-medium text-muted border-0 pb-3 text-end">Price</th>
                                            <th className="fw-medium text-muted border-0 pb-3 text-end pe-0">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items?.map((item, index) => (
                                            <tr key={index} className="border-0">
                                                <td className="py-3 border-0 ps-0">
                                                    <div className="d-flex align-items-center">
                                                        {item?.productId?.images?.[0] && (
                                                            <img
                                                                src={item.productId.images[0]}
                                                                alt={item?.productId?.model || 'Product'}
                                                                className="me-3 rounded"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        )}
                                                        <span className="fw-medium">
                                                            {item?.productId?.model || 'Product Name'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 border-0 text-end">
                                                    {item?.price?.toLocaleString('vi-VN') || '0'}
                                                </td>
                                                <td className="py-3 border-0 text-center">
                                                    {item?.quantity || 0}
                                                </td>
                                                <td className="py-3 border-0 text-end pe-0">
                                                    {((item?.price || 0) * (item?.quantity || 0)).toLocaleString('vi-VN')}
                                                    {order.orderStatus !== 'completed' && !item.reviewed && (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary ms-3"
                                                            onClick={() => {
                                                                setShowReviewModal(true)
                                                                setSelectedProduct(item)   
                                                            }}
                                                        >
                                                            Review
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <div className="border-top pt-4">
                                <Row className="mb-2">
                                    <Col>
                                        <span className="text-muted">Subtotal</span>
                                    </Col>
                                    <Col className="text-end">
                                        <span>{order?.subtotal?.toLocaleString('vi-VN') || '0'}</span>
                                    </Col>
                                </Row>

                                {order?.voucher?.discountAmount > 0 && (
                                    <Row className="mb-2">
                                        <Col>
                                            <span className="text-muted">Voucher Discount</span>
                                        </Col>
                                        <Col className="text-end">
                                            <span className="text-success fw-medium">
                                                -{order.voucher.discountAmount.toLocaleString('vi-VN')}
                                            </span>
                                        </Col>
                                    </Row>
                                )}

                                <Row className="mb-3">
                                    <Col>
                                        <span className="text-muted">Shipping Fee</span>
                                    </Col>
                                    <Col className="text-end">
                                        <span>
                                            {order?.shippingFee > 0
                                                ? `${order.shippingFee.toLocaleString('vi-VN')}`
                                                : 'Free'}
                                        </span>
                                    </Col>
                                </Row>

                                <Row className="border-top pt-3">
                                    <Col>
                                        <h5 className="fw-bold mb-0">Total Amount</h5>
                                    </Col>
                                    <Col className="text-end">
                                        <h5 className="fw-bold mb-0 text-danger">
                                            {order?.totalAmount?.toLocaleString('vi-VN') || '0'} VND
                                        </h5>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={12}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                <h4 className="fw-bold mb-2">Order Information</h4>
                                <p className="text-muted mb-0">Status and payment details.</p>
                            </div>

                            <div className="mb-4">
                                <Row className="mb-3 align-items-center">
                                    <Col sm={6}>
                                        <span className="text-dark fw-medium">Order Date</span>
                                    </Col>
                                    <Col sm={6} className="text-end">
                                        <span className="">
                                            {formatDate ? formatDate(order?.createdAt) : order?.createdAt || 'N/A'}
                                        </span>
                                    </Col>
                                </Row>

                                <Row className="mb-3 align-items-center">
                                    <Col sm={6}>
                                        <span className="text-dark fw-medium">Payment Method</span>
                                    </Col>
                                    <Col sm={6} className="text-end">
                                        <span className="">{order?.paymentMethod || 'N/A'}</span>
                                    </Col>
                                </Row>

                                <Row className="mb-3 align-items-center">
                                    <Col sm={6}>
                                        <span className="text-dark fw-medium">Payment Status</span>
                                    </Col>
                                    <Col sm={6} className="text-end fw-bold">
                                        {
                                            order?.paymentStatus
                                                ? <span
                                                    style={{
                                                        backgroundColor: paymentStatusMap[order?.paymentStatus].bgColor,
                                                        color: paymentStatusMap[order?.paymentStatus].color
                                                    }}
                                                    className='p-2 py-1 rounded-pill'
                                                >{order?.paymentStatus}</span>
                                                : <span>{toReadAble(order?.paymentStatus)}</span>
                                        }
                                    </Col>
                                </Row>

                                <Row className="mb-3 align-items-center">
                                    <Col sm={6}>
                                        <span className="text-dark fw-medium">Order Status</span>
                                    </Col>
                                    <Col sm={6} className="text-end fw-bold">
                                        {
                                            order?.orderStatus
                                                ? <span
                                                    style={{
                                                        backgroundColor: orderStatusMap[order?.orderStatus].bgColor,
                                                        color: orderStatusMap[order?.orderStatus].color
                                                    }}
                                                    className='p-2 py-1 rounded-pill'
                                                >{order?.orderStatus}</span>
                                                : <span>{toReadAble(order?.orderStatus)}</span>
                                        }
                                    </Col>
                                </Row>
                            </div>

                            {order?.note && order.note.trim() && (
                                <div className="mt-4 pt-3 border-top">
                                    <div className="mb-2">
                                        <span className="text-dark fw-bold">Note:</span>
                                    </div>
                                    <p className="text-muted mb-0 small">{order.note}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ReviewModal showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} selectedProduct={selectedProduct} />
        </div>
    )
}