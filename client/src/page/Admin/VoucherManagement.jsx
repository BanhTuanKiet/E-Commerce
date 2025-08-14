import React, { use, useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Form, Badge, ProgressBar, Modal, InputGroup, Alert } from 'react-bootstrap'
import axios from '../../util/AxiosConfig'
import { getVoucherStatus } from '../../util/BadgeUtil'
import VoucherDetailModal from '../../component/Modal/VoucherDetailModal'
import StatusItemCard from '../../component/Card/StatusItemCard'
import PaginationProducts from '../../component/Pagination'
import AddVoucherModal from '../../component/Modal/AddVoucherModal'

export default function VoucherManagement({ activeTab }) {
  const [vouchers, setVouchers] = useState()
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterSelections, setFilterSelections] = useState({})
  const timeoutVouchertRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [voucherStates, setVoucherStates] = useState({
    total: 0,
    active: 0,
    pause: 0,
    expired: 0,
    upcoming: 0,
  })

  useEffect(() => {
    if (activeTab !== "product") return

    setFilterSelections({
      category: '',
      state: ''
    })
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "voucher") return
    if (timeoutVouchertRef.current) {
      clearTimeout(timeoutVouchertRef.current)
    }

    timeoutVouchertRef.current = setTimeout(async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/vouchers/filter?options=${options}`)
        setVouchers(response.data)
        setCurrentPage(1)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }, [activeTab, filterSelections])

  useEffect(() => {
    if (activeTab !== "voucher") return

    const fetchVouchers = async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/vouchers/filter?options=${options}&page=${currentPage}`)
        setVouchers(response.data)
        setCurrentPage(1)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }

    fetchVouchers()
  }, [activeTab, currentPage])

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher)
    setShowDetailModal(true)
  }

  const handleFilter = (key, value) => {
    setFilterSelections({ ...filterSelections, [key]: value })
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '20px' }}>
      <Container fluid>
        <Row className="mb-4">
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <h1 className="display-5 fw-bold text-dark">Voucher management</h1>
            <p className="text-muted">Manage voucher and promotions</p>
          </Col>
          {Object?.entries(voucherStates)?.map(([key, value]) => {
            const isActive = filterSelections.state === key

            return (
              <Col md={3} key={key} className="mb-3">
                <StatusItemCard handleFilter={handleFilter} type="voucher" label={key} value={value} isActive={isActive} />
              </Col>
            )
          })}
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    name='code'
                    className="form-control ps-5"
                    placeholder="Seach by CODE or description..."
                    value={filterSelections?.code ?? ""}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  />
                </div>
              </Col>
              <Col lg={3} className="">
                <Form.Select
                  value={filterSelections?.discountType ?? ''}
                  onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  name='discountType'
                >
                  <option value="">All type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </Form.Select>
              </Col>
              <Col lg={2} className="d-flex align-items-center justify-content-end">
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  ➕ Add voucher
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            {vouchers?.length === 0 ? (
              <Alert variant="info" className="text-center">
                <div className="fs-1 mb-3">🏷️</div>
                <h5>Không tìm thấy voucher</h5>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Voucher Id</th>
                      <th>Description</th>
                      <th>Discount</th>
                      <th>Condition</th>
                      <th>Used</th>
                      <th>Validity period</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers?.map((voucher) => (
                      <tr key={voucher._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <code className="fw-bold text-primary">{voucher.code}</code>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            <p className="mb-1 fw-medium">{voucher.description}</p>
                            {voucher.categories.length > 0 && (
                              <div className="d-flex flex-wrap gap-1">
                                {voucher.categories.slice(0, 2).map((category, index) => (
                                  <Badge key={index} bg="outline-secondary" className="text-dark border">
                                    {category}
                                  </Badge>
                                ))}
                                {voucher.categories.length > 2 && (
                                  <Badge bg="outline-secondary" className="text-dark border">
                                    +{voucher.categories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            {voucher.discountType === "percentage" ? (
                              <Badge bg="warning" text="dark">
                                📊 {voucher.discountValue}%
                              </Badge>
                            ) : (
                              <Badge bg="success">
                                💰 {voucher.discountValue.toLocaleString('vi-VN')}
                              </Badge>
                            )}
                            {voucher.maxDiscount && (
                              <div className="small text-muted mt-1">
                                Max: {voucher.maxDiscount.toLocaleString('vi-VN')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            {voucher.minOrderValue && (
                              <div>
                                Min order value: {voucher.minOrderValue.toLocaleString('vi-VN')}
                              </div>
                            )}
                            <div className="text-muted">
                              Limit: {voucher.usageLimitPerUser} time/person
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="small fw-medium">
                                {voucher.used}/{voucher.quantity}
                              </span>
                            </div>
                            <ProgressBar
                              now={(voucher.used / voucher.quantity) * 100}
                              style={{ height: '6px' }}
                            />
                            <div className="small text-muted mt-1">
                              {((voucher.used / voucher.quantity) * 100).toFixed(1)}% used
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div>From: {new Date(voucher.startDate).toLocaleDateString("vi-VN")}</div>
                            <div>To: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}</div>
                          </div>
                        </td>
                        <td>{getVoucherStatus(voucher)}</td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewDetails(voucher)}
                            >
                              👁️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>

          <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Card>

        <AddVoucherModal show={showAddModal} setShow={setShowAddModal} />
        <VoucherDetailModal selectedVoucher={selectedVoucher} showDetailModal={showDetailModal} setShowDetailModal={setShowDetailModal} />
      </Container>
    </div>
  )
} 