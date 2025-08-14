import { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormLabel, Modal, Row } from 'react-bootstrap'
import { toReadAble } from '../../util/DataClassify'
import axios from '../../util/AxiosConfig'

export default function AddVoucherModal({ show, setShow }) {
  const [formData, setFormData] = useState({})
  const [categories, setCategories] = useState()
  const [keys, setKeys] = useState()

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await axios.get(`/productFields/${"voucher"}`)
        console.log(response.data)
        setKeys(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchKeys()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  const handleClose = () => setShow(false)
  const handleSubmitChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/vouchers`, { voucher: formData })
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev?.categories || [], category.name],
    }))
  }

  const handleRemoveCategory = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev?.categories.filter((_, i) => i !== indexToRemove),
    }))
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Add New Voucher</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-muted mb-4">
            Fill in the voucher details below to add a new item to your inventory.
          </p>

          <Form onSubmit={handleSubmit}>
            <Row>
              {keys && typeof keys === 'object' && Object.entries(keys)?.map(([key, value], index) => {
                if (['_id', 'type', 'categories', 'usageLimitPerUser'].includes(key)) return null
                if (key === 'discountType')
                  return (
                    <Col md={6}>
                      <div className='mb-3'>
                        <FormLabel className='text-muted'>Loại giảm giá</FormLabel>
                        <Form.Select
                          type={value}
                          name={key}
                          value={formData[key]}
                          onChange={(e) => handleSubmitChange(e)}
                          placeholder={`Enter ${toReadAble(key)}`}
                          required
                        >
                          <option value="all">Tất cả loại</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </Form.Select>
                      </div>
                    </Col>
                  )
                return (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {toReadAble(key)} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type={value}
                        name={key}
                        value={formData[key]}
                        onChange={(e) => handleSubmitChange(e)}
                        placeholder={`Enter ${toReadAble(key)}`}
                        required
                      />
                    </Form.Group>
                  </Col>
                )
              })}
            </Row>
            <div className="mb-4">
              <h5 className="mb-3">Danh mục áp dụng</h5>
              <div className="d-flex flex-wrap gap-2">
                {formData?.categories?.map((category, index) => (
                  <Badge
                    key={index}
                    bg="info"
                    className="d-flex align-items-center gap-1"
                  >
                    {category}
                    <span
                      onClick={() => handleRemoveCategory(index)}
                      style={{ cursor: "pointer", marginLeft: '6px' }}
                    >
                      &times;
                    </span>
                  </Badge>
                ))}
                {Array.isArray(categories) &&
                  categories
                    .filter(cat => !formData?.categories?.includes(cat.name))
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
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={false}
          >
            {"Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
