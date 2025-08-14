import React, { useState, useRef, useEffect, useContext } from "react"
import { Modal, Button, Form, Row, Col, Card, Badge } from "react-bootstrap"
import { Plus, X } from "lucide-react"
import axios from "../../util/AxiosConfig"
import { toReadAble } from "../../util/DataClassify"

export default function AddModal({ show, setShow }) {
  const [categories, setCategories] = useState()
  const [primitiveKeys, setPrimitiveKeys] = useState()
  const [objectKeys, setObjectKeys] = useState()
  const [formData, setFormData] = useState()
  const fileInputRef = useRef()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/categories`)
        setCategories(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!categories || categories.length === 0 || !formData?.category) return

    const fetchKeyProduct = async () => {
      try {
        const response = await axios.get(`/productFields/${"product"}`)
        setPrimitiveKeys(response.data.common)
        setObjectKeys(response.data[formData.category])
      } catch (error) {
        console.log(error)
      }
    }

    fetchKeyProduct()
  }, [formData?.category, categories])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmitChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    if (name === "price" || name === "stock") {
      value = parseInt(value)
    }

    if (e.target.type === 'checkbox') {
      let checked = e.target.checked
      const [key, childKey] = name.split(".")

      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [childKey]: checked,
        },
      }))
      return
    }

    if (name.indexOf(".") > 0) {
      const [key, childKey] = name.split(".")

      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [childKey]: value,
        },
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result
      if (!formData?.images?.includes(imageUrl)) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev?.images || [], imageUrl],
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(formData)
      const response = await axios.post(`/products/manage`, { product: formData })
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-muted mb-4">
            Fill in the product details below to add a new item to your inventory.
          </p>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={formData?.category}
                    name="category"
                    onChange={(e) => handleSubmitChange(e)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {primitiveKeys && typeof primitiveKeys === 'object' && Object.entries(primitiveKeys).map(([key, value], index) => {
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

              {objectKeys && typeof objectKeys === 'object' && (
                <>
                  {Object.entries(objectKeys)
                    .filter(([_, value]) => typeof value === 'string')
                    .map(([key, value], index) => (
                      <Col md={6} key={`primitive-${index}`}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {toReadAble(key)} <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type={value}
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleSubmitChange}
                            placeholder={`Enter ${toReadAble(key)}`}
                            required
                          />
                        </Form.Group>
                      </Col>
                    ))}

                  {Object.entries(objectKeys)
                    .filter(([_, value]) => typeof value === 'object')
                    .map(([key, value], index) => (
                      <div key={`object-${index}`}>
                        <h5 className="mt-3">{toReadAble(key)}</h5>
                        <Row>
                          {Object.entries(value).map(([childKey, childValue], childIndex) => {
                            if (typeof childValue === 'string') {
                              return (
                                <Col md={6} key={`child-${childIndex}`}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>
                                      {toReadAble(childKey)} <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                      type={childValue}
                                      name={`${key}.${childKey}`}
                                      onChange={handleSubmitChange}
                                      placeholder={`Enter ${toReadAble(childKey)}`}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              )
                            }
                            return null
                          })}
                        </Row>
                      </div>
                    ))}
                </>
              )}

            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>

              <Row className="mb-3">
                <Col xs="auto">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: "100px",
                      height: "140px",
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    <Plus size={32} />
                    <small>Add Image</small>
                  </div>
                </Col>
              </Row>

              {formData?.images?.length > 0 && (
                <>
                  <div className="d-flex align-items-center mb-2">
                    <small className="text-muted me-2">Added Images</small>
                    <Badge bg="secondary">{formData.images.length}</Badge>
                  </div>
                  <Row>
                    {formData.images.map((image, index) => (
                      <Col xs={6} md={4} key={index} className="mb-3">
                        <Card className="position-relative">
                          <div
                            style={{
                              height: "140px",
                              overflow: "hidden",
                              backgroundColor: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute"
                            style={{
                              top: "-8px",
                              right: "-8px",
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <X size={12} />
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Form.Group>
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
