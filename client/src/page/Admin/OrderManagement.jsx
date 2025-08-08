import axios from '../../util/AxiosConfig'
import { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Table, Form, Button, InputGroup } from 'react-bootstrap'
import StateProductCard from '../../component/Card/StateProductCard'
import PaginationProducts from '../../component/Pagination'
import { getPaymentMethodBadge, getPaymentStatusBadge, getOrderStatusBadge } from '../../util/BadgeUtil'
import { FolderOutput } from 'lucide-react'
import OrderDetail from "./OrderDetail"

export default function OrderManagement({ activeTab }) {
  const [orders, setOrders] = useState()
  const [orderId, setOrderId] = useState()
  const [orderStates, setOrderStates] = useState({
    processing: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0
  })
  const timeoutSearchOrderRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [filterSelections, setFilterSelections] = useState({
    orderStatus: '',
    paymentStatus: '',
    paymentMethod: ''
  })
  const stateIcons = {
    processing: { icon: "bi bi-boxes", color: "text-primary", label: "Tổng sản phẩm" },
    confirmed: { icon: "bi bi-check-circle", color: "text-success", label: "Còn hàng" },
    shipping: { icon: "bi bi-exclamation-triangle", color: "text-warning", label: "Sắp hết hàng" },
    delivered: { icon: "bi bi-x-circle", color: "text-danger", label: "Hết hàng" },
    cancelled: { icon: "bi bi-tags", color: "text-info", label: "Giảm giá" },
  }

  useEffect(() => {
    if (activeTab !== "order") return

    setFilterSelections({
      orderStatus: '',
      paymentStatus: '',
      paymentMethod: ''
    })
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "order") return
    if (timeoutSearchOrderRef.current) {
      clearTimeout(timeoutSearchOrderRef.current)
    }

    timeoutSearchOrderRef.current = setTimeout(async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/orders/filter?options=${options}`)

        setOrders(response.data)
        setCurrentPage(1)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }, [activeTab, filterSelections])

  useEffect(() => {
    if (activeTab !== "order") return

    const fetchProducts = async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/orders/filter?options=${options}&page=${currentPage}`)

        setOrders(response.data)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProducts()
  }, [activeTab, currentPage])

  useEffect(() => {
    if (activeTab !== "order") return

    const fetchOrderStates = async () => {
      try {
        const responses = await Promise.all(
          Object.entries(orderStates).map(([key, value]) => {
            return axios.get(`/orders/state/count/${key}`)
          })
        )

        const newStates = {}
        let total = 0
        responses.forEach(({ key, data }) => {
          newStates[key] = data
          total += data
        })

        newStates["total"] = total

        setOrderStates(prev => ({ ...prev, ...newStates }))
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrderStates()
  }, [orders])

  const handleFilter = (key, value) => {
    setFilterSelections({ ...filterSelections, [key]: value })
  }

  if (orderId) {
    return (
      <OrderDetail orderId={orderId} setOrderId={setOrderId} />
    )
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col lg={6}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h1 className="h2 text-dark mb-1">Quản lý đơn hàng</h1>
                <p className="text-muted">Quản lý và theo dõi tất cả đơn hàng</p>
              </div>
            </div>
          </Col>
          {Object?.entries(orderStates)?.map(([key, value]) => {
            const icon = stateIcons[key]?.icon || "bi bi-box"
            const color = stateIcons[key]?.color || "text-muted"
            const isActive = filterSelections.orderStatus === key

            return (
              <Col md={3} key={key} className="mb-3">
                <StateProductCard handleFilter={handleFilter} type="order" label={key} value={value} icon={icon} color={color} isActive={isActive} />
              </Col>
            )
          })}
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col lg={4} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name='searchTerm'
                    placeholder="Tìm kiếm theo ID, tên, email, SĐT..."
                    value={filterSelections?.searchTerm ?? ""}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} className="mb-3">
                <Form.Select
                  name='paymentStatus'
                  value={filterSelections.paymentStatus}
                  onChange={(e) => handleFilter(e.target.name, e.target.value)}
                >
                  <option value="">All payment status</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Col>
              <Col lg={3} className="mb-3">
                <Form.Select
                  name='paymentMethod'
                  value={filterSelections.paymentMethod}
                  onChange={(e) => handleFilter(e.target.name, e.target.value)}
                >
                  <option value="">All payment method</option>
                  <option value="COD">COD</option>
                  <option value="VNPay">VNPay</option>
                  <option value="Momo">Momo</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <div className="mb-3 d-flex">
                  <label htmlFor="createdAtFrom" className="form-label my-auto me-2">From</label>
                  <input
                    type="date"
                    id="createdAtFrom"
                    name="createdAtFrom"
                    className="form-control"
                    value={filterSelections?.createdAtFrom ?? ""}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-3 d-flex">
                  <label htmlFor="createdAtTo" className="form-label my-auto me-2">To</label>
                  <input
                    type="date"
                    id="createdAtTo"
                    name="createdAtTo"
                    className="form-control"
                    value={filterSelections?.createdAtTo ?? ""}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  />
                </div>
              </Col>

            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="mb-0">Danh sách đơn hàng ({orders?.length})</Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order Id</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order State</th>
                    <th>Created At</th>
                    <th className='text-end'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order._id} className='align-middle'>
                      <td>
                        <code className="small">#{order._id.slice(-8).toUpperCase()}</code>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{order.customerId.name}</div>
                          <small className="text-muted">{order.customerId.phone}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="small fw-medium">{order.items.length} sản phẩm</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{order.totalAmount.toLocaleString('vi-VN')}</div>
                          {order.voucher.discountAmount > 0 && (
                            <small className="text-success">
                              Giảm {(order.voucher.discountAmount)}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {getPaymentMethodBadge(order.paymentMethod)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                      </td>
                      <td>{getOrderStatusBadge(order.orderStatus)}</td>
                      <td>
                        <div className="small">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="small text-muted">
                          {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setOrderId(order?._id)}
                          >
                            Detail
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}