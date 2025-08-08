import React, { useEffect, useState } from 'react'
import { Badge, Button, ButtonGroup, Card, Col, Form, FormControl, FormLabel, Modal, Row } from 'react-bootstrap'
import { getVoucherStatus } from '../../util/BadgeUtil'
import { Ban, Delete, Edit, Save } from 'lucide-react'
import axios from '../../util/AxiosConfig'

export default function VoucherDetailModal({ selectedVoucher, showDetailModal, setShowDetailModal }) {
  const [voucherEditing, setVoucherEditing] = useState()
  const [isEdit, setIsEdit] = useState(false)
  const [editFields, setEditFields] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState()

  useEffect(() => {
    if (!isEdit) {
      setEditFields({})
      setVoucherEditing(selectedVoucher)
    }
  }, [isEdit, selectedVoucher])

  useEffect(() => {
    if (!isEdit) return

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/categories`)
        setCategories(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [isEdit])

  const handleEdit = () => {
    const newIsEdit = {}
    setIsEdit(true)
    Object.entries(selectedVoucher).forEach(([key, value]) => {
      if (['_id', 'usageLimitPerUser', 'isActive', 'updatedAt', 'createdAt', 'used'].includes(key)) return

      if (Array.isArray(value)) {
        value.forEach((_, index) => {
          newIsEdit[`${key}[${index}]`] = true
        })
      } else {
        newIsEdit[key] = true
      }
    })

    setEditFields(newIsEdit)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setVoucherEditing(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await axios.put(`/vouchers`, { voucher: voucherEditing })
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleStatus = async (voucherId) => {
    try {
      await axios.put(`/vouchers/status/${voucherId}`)
      setVoucherEditing(prev => ({
        ...prev,
        isActive: !prev.isActive
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveCategory = (indexToRemove) => {
    setVoucherEditing((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== indexToRemove),
    }))
  }

  const handleAddCategory = (category) => {
    setVoucherEditing((prev) => ({
      ...prev,
      categories: [...prev.categories, category.name],
    }));
  }

  return (
    <Modal
      show={showDetailModal}
      onHide={() => setShowDetailModal(false)}
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Voucher</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {voucherEditing && (
          <div>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="w-50">
                <FormLabel>
                  <h2 className="mb-0">
                    <code className="text-primary">{voucherEditing.code}</code>
                  </h2>
                </FormLabel>
                <FormControl
                  name="description"
                  value={voucherEditing?.description || ''}
                  disabled={!editFields.description}
                  onChange={(e) => handleChange(e)}
                  size="sm"
                />
              </div>

              {getVoucherStatus(voucherEditing)}
            </div>

            <hr />

            <Row className="mb-4">
              <Col md={6}>
                <h5 className="mb-3">Thông tin giảm giá</h5>
                <div className="mb-3">
                  <div className='mb-2'>
                    <FormLabel className='text-muted'>Loại giảm giá</FormLabel>
                    <Form.Select
                      name='discountType'
                      disabled={!voucherEditing.discountType}
                      value={voucherEditing.discountType}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="all">Tất cả loại</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </Form.Select>
                  </div>
                  <div className="mb-2">
                    <FormLabel className="text-muted"></FormLabel>
                    <FormControl
                      size="sm"
                      name="discountValue"
                      type="text"
                      disabled={!editFields.discountValue}
                      value={voucherEditing.discountValue}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  {voucherEditing.maxDiscount !== undefined && (
                    <div className="mb-2">
                      <FormLabel className="text-muted">Giảm tối đa</FormLabel>
                      <FormControl
                        size="sm"
                        name="maxDiscount"
                        type="number"
                        disabled={!editFields.maxDiscount}
                        value={voucherEditing.maxDiscount}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  )}

                  {voucherEditing.minOrderValue !== undefined && (
                    <div>
                      <FormLabel className="text-muted">Đơn hàng tối thiểu</FormLabel>
                      <FormControl
                        size="sm"
                        name="minOrderValue"
                        type="number"
                        disabled={!editFields.minOrderValue}
                        value={voucherEditing.minOrderValue}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <h5 className="mb-3">Điều kiện sử dụng</h5>
                <div className="mb-3">
                  <div className="mb-2">
                    <FormLabel className="text-muted">Tổng số lượng</FormLabel>
                    <FormControl
                      size="sm"
                      name="quantity"
                      type="number"
                      disabled={!editFields.quantity}
                      value={voucherEditing.quantity}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="mb-2">
                    <FormLabel className="text-muted">Đã sử dụng</FormLabel>
                    <FormControl
                      size="sm"
                      name="usedCount"
                      type="number"
                      disabled
                      value={voucherEditing.used}
                    />
                  </div>

                  <div className='mb-2'>
                    <Form.Label className="form-label text-muted small">Quantity</Form.Label>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <small className="text-muted">{voucherEditing.used}/</small>
                        <Form.Control
                          type="number"
                          name="stock"
                          size="sm"
                          className='w-25'
                          value={voucherEditing?.quantity || ''}
                          disabled={!editFields.quantity}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="progress mb-1" style={{ height: '8px' }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(voucherEditing?.used / voucherEditing.quantity) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <FormLabel className="text-muted">Còn lại</FormLabel>
                    <FormControl
                      size="sm"
                      disabled
                      value={voucherEditing.quantity - voucherEditing.used}
                    />
                  </div>

                  <div className="mb-2">
                    <FormLabel className="text-muted">Giới hạn / người</FormLabel>
                    <FormControl
                      size="sm"
                      name="usageLimitPerUser"
                      type="number"
                      disabled={!editFields.usageLimitPerUser}
                      value={voucherEditing.usageLimitPerUser}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div>{getVoucherStatus(voucherEditing)}</div>
                </div>
              </Col>
            </Row>

            <hr />

            <div className="mb-4">
              <h5 className="mb-3">Thời gian áp dụng</h5>
              <Row>
                <Col md={6}>
                  <Card className="border-success">
                    <Card.Body className="bg-light">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-success">📅</span>
                        <strong className="text-success">Ngày bắt đầu</strong>
                      </div>
                      {editFields.startDate ? (
                        <Form.Control
                          type="datetime-local"
                          name="startDate"
                          size="sm"
                          value={voucherEditing?.startDate.toLocaleString('vi-VN')}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="mb-0 text-success">
                          {new Date(voucherEditing?.startDate).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-danger">
                    <Card.Body className="bg-light">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-danger">📅</span>
                        <strong className="text-danger">Ngày kết thúc</strong>
                      </div>
                      {editFields.endDate ? (
                        <Form.Control
                          type="datetime-local"
                          name="endDate"
                          size="sm"
                          value={voucherEditing?.endDate.toLocaleString('vi-VN')}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="mb-0 text-success">
                          {new Date(voucherEditing?.endDate).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            {voucherEditing.categories.length > 0 && (
              <>
                <hr />
                <div className="mb-4">
                  <h5 className="mb-3">Danh mục áp dụng</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {voucherEditing.categories.map((category, index) => (
                      <Badge
                        key={index}
                        bg="info"
                        className="d-flex align-items-center gap-1"
                      >
                        {category}
                        {isEdit && (
                          <span
                            onClick={() => handleRemoveCategory(index)}
                            style={{ cursor: "pointer", marginLeft: '6px' }}
                          >
                            &times;
                          </span>
                        )}
                      </Badge>
                    ))}
                    {isEdit && Array.isArray(categories) &&
                      categories
                        .filter(cat => !voucherEditing?.categories.includes(cat.name))
                        .map((cat, index) => (
                          <Badge
                            key={index}
                            bg="secondary"
                            className="d-flex align-items-center gap-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleAddCategory(cat)}
                          >
                            {cat.name}
                            <span style={{ marginLeft: '6px' }}>+</span>
                          </Badge>
                        ))}
                  </div>
                </div>
              </>
            )}
            <hr />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex gap-2">
          <ButtonGroup>
            {isEdit ?
              <>
                <Button variant='outline-danger' onClick={() => setIsEdit(false)}>
                  <Ban size={16} className='me-2' />
                  Cancel
                </Button>
                <Button variant='outline-warning' onClick={() => handleSave()}>
                  <Save size={16} className='me-2' />
                  Save
                </Button>
              </>
              :
              <Button variant='outline-primary' onClick={(e) => handleEdit(e)}>
                <Edit size={16} className="me-2" />
                Edit
              </Button>

            }
            <Button variant='danger' >
              <Delete size={16} className="me-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            <Button
              variant="outline-secondary"
              onClick={() => voucherEditing && handleToggleStatus(voucherEditing._id)}
            >
              {voucherEditing?.isActive ? "Pause" : "Active"}
            </Button>
          </ButtonGroup>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
