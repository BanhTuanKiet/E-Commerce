import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button, Image, ButtonGroup } from "react-bootstrap"
import { ArrowLeft, Edit, Printer, Download, Truck, Package, CreditCard } from "lucide-react"
import { getOrderStatusBadge, getPaymentMethodBadge, getPaymentStatusBadge } from "../../util/BadgeUtil"
import axios from "../../util/AxiosConfig"
import CustomerCard from "../../component/Card/CustomerCard"
import OrderStatusCard from "../../component/Card/OrderStatusCard"
import StatusHistory from "../../component/Card/StatusHistory"

const OrderDetail = ({ orderId, setOrderId }) => {
  const [order, setOrder] = useState()
  const [newComment, setNewComment] = useState("")
  const [status, setStatus] = useState({
    orderStatus: "",
    paymentStatus: ""
  })

  useEffect(() => {
    if (!orderId) return
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (!order) return

    setStatus(prevOrder => ({
      ...prevOrder,
      orderStatus: order?.orderStatus,
      paymentStatus: order?.paymentStatus
    }))
  }, [order])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/orders/detail/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveStatus = async () => {
    try {
      console.log(status)
      await axios.put(`/orders/status/${order?._id}`, { status })
      await fetchOrder()
    } catch (error) {
      console.log(error)
    }
  }

  const handleStatus = (e) => {
    setStatus({ ...status, [e.target.name]: e.target.value })
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" size="sm" onClick={() => setOrderId()}>
                  <ArrowLeft size={16} className="me-2" />
                  Go back
                </Button>
                <div>
                  <code className="fw-bold mb-1">
                    Order #{order?._id.slice(-8).toUpperCase()}
                  </code>
                  <p className="text-muted mb-0">
                    Created at {new Date(order?.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <ButtonGroup>
                <Button variant="outline-secondary">
                  <Printer size={16} className="me-2" />
                  In hóa đơn
                </Button>
                <Button variant="outline-secondary">
                  <Download size={16} className="me-2" />
                  Tải xuống
                </Button>
                <Button variant="primary">
                  <Edit size={16} className="me-2" />
                  Chỉnh sửa
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-info bg-opacity-10 rounded">
                    <Package size={20} className="text-info" />
                  </div>
                  <div>
                    <small className="text-muted">Order status</small>
                    <div className="mt-1">{getOrderStatusBadge(order?.orderStatus)}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-success bg-opacity-10 rounded">
                    <CreditCard size={20} className="text-success" />
                  </div>
                  <div>
                    <small className="text-muted">Payment</small>
                    <div>
                      <span className="mt-1">{getPaymentStatusBadge(order?.paymentStatus)}</span>
                      <span className="mt-1">{getPaymentMethodBadge(order?.paymentMethod)}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-primary bg-opacity-10 rounded">
                    <Truck size={20} className="text-primary" />
                  </div>
                  <div>
                    <small className="text-muted">Transport</small>
                    <div className="fw-medium">Fast delivery #GHN123456789</div>
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
                  <Package size={20} />
                  Product
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  {order?.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
                      <Image
                        src={item.productId.images[0]}
                        alt={item.productId.model}
                        width={80}
                        height={80}
                        className="rounded object-fit-cover"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.productId.model}</h6>
                        <small className="text-muted">SKU: {item.productId._id}</small>
                        <div className="d-flex gap-3 mt-2">
                          <small>Quantity: {item.quantity}</small>
                          <small>Price: {item.price.toLocaleString('vi-VN')}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <h6 className="mb-0">{(item.quantity * item.price).toLocaleString('vi-VN')}</h6>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <small>Subtotal:</small>
                    <small>{order?.subtotal.toLocaleString('vi-VN')}</small>
                  </div>
                  {order?.voucher.discountAmount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <small>Discount ({order?.voucher.code}):</small>
                      <small>-{(order?.voucher.discountAmount)}</small>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <small>Phí vận chuyển:</small>
                    <small>Free</small>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <h5 className="text-success">{order?.totalAmount.toLocaleString('vi-VN')}</h5>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <StatusHistory statusHistory={order?.statusHistory} />
          </Col>

          <Col lg={4}>
            <CustomerCard customer={order?.customerId} />

            <OrderStatusCard handleStatus={handleStatus} handleSaveStatus={handleSaveStatus} status={status} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default OrderDetail