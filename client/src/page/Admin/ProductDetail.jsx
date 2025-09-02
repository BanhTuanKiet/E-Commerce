import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap'
import axios from '../../config/AxiosConfig'
import { toReadAble, getObject } from '../../util/DataClassify'
import { ArrowLeft, Ban, Delete, Edit, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const maxStock = 100

export default function ProductDetail({ productId, setProductId, handleTab, indexFilter, setIndexFilter }) {
  const [product, setProduct] = useState()
  const [activeTab, setActiveTab] = useState("overview")
  const [keys, setKeys] = useState()
  const [editFileds, setEditFields] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/detail/${productId}`)
        setProduct(response.data)
        setKeys(getObject(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    if (!keys || keys.length === 0) return
    setActiveTab(keys[0])
  }, [keys])

  useEffect(() => {
    if (!isEdit) setEditFields({})
  }, [isEdit])

  const handleEdit = (e) => {
    const { name, value } = e.target

    if (!name.includes(".")) {
      setProduct((prev) => ({
        ...prev,
        [name]:
          name === "stock" || name === "discountPrice"
            ? parseFloat(value) || 0
            : value,
      }))
      return
    }

    const [parentKey, childKey] = name.split(".")
    setProduct((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }))
  }

  const handleClick = () => {
    const newIsEdit = {}
    setIsEdit(true)
    Object.entries(product).forEach(([key, value]) => {
      if (['_id', 'images', 'createdAt', 'reviews', 'sold', 'avsScore'].includes(key)) return

      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([childKey]) => {
          newIsEdit[`${key}.${childKey}`] = true
        })
      } else {
        newIsEdit[key] = true
      }
    })

    setEditFields(newIsEdit)
  }

  const handleSave = async () => {
    try {
      const { state, createdAt, reviews, sold, avgScore, ...safeProduct } = product
      await axios.put(`/products`,  safeProduct)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await axios.delete(`/products/manage/${product?._id}`)
      setProductId()
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleNavigate = () => {
    console.log("AAAAAAA")
    setIndexFilter({
      searchTerm: product?.model
    })
    handleTab("review")
    navigate("/manage")
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" size="sm" onClick={() => setProductId()}>
                  <ArrowLeft size={16} className="me-2" />
                  Go back
                </Button>
                <div>
                  <code className="fw-bold mb-1">
                    Product #{product?._id.toUpperCase()}
                  </code>
                  <p className="text-muted mb-0">
                    Created at {new Date(product?.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
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
                  <Button variant='outline-primary' onClick={(e) => handleClick(e)}>
                    <Edit size={16} className="me-2" />
                    Edit
                  </Button>

                }
                <Button variant='danger' onClick={() => handleDelete(product?._id)}>
                  <Delete size={16} className="me-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={4} >
            <Card>
              <Card.Body>
                <div className="mb-3">
                  <div className="ratio ratio-1x1 mb-3">
                    <img
                      src={product?.images[0]}
                      alt={product?.model}
                      className="img-fluid rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center py-2">
                <h5 className="mb-0">Basic information</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3 mb-0">
                  <Col md={6} className='mt-2'>
                    <label className="form-label text-muted small">ID</label>
                    <div className="d-flex align-items-center">
                      <code className="me-2">{product?._id}</code>
                    </div>
                  </Col>
                  <Col md={6} className='mt-2'>
                    <Form.Label className="text-muted small">Model</Form.Label>
                    <Form.Control
                      name="model"
                      value={product?.model || ''}
                      disabled={!editFileds.model}
                      onChange={(e) => handleEdit(e)}
                      size="sm"
                    />
                  </Col>
                  <Col md={6} className='mt-2'>
                    <label className="form-label text-muted small">Category</label>
                    <div><code>{product?.category}</code></div>
                  </Col>
                  <Col md={6} className='mt-2'>
                    <label className="form-label text-muted small">Brand</label>
                    <div><code>{product?.brand}</code></div>
                  </Col>
                </Row>

                <hr />

                <Row className="g-3">
                  <Col md={6} className='mt-2' >
                    <Form.Label className="form-label text-muted small">Price</Form.Label>
                    <div>
                      <div className="h4 text-success mb-1">
                        {(product?.price * (1 - (product?.discount / 100))).toLocaleString('vi-VN')}
                      </div>
                      {/* {product?.discount > 0 && product?.state === 'sale' && ( */}
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted text-decoration-line-through">
                          {product?.price.toLocaleString('vi-VN')}
                        </small>
                        <span className="badge bg-danger">
                          -{product?.discount}%
                        </span>
                      </div>
                      {/* )} */}
                    </div>
                    <Form className='d-flex'>
                      <Form.Label className="form-label text-muted small mt-3">Discount Price</Form.Label>
                      <div className="d-flex align-items-center gap-2">
                        <Form.Control
                          type="number"
                          size="sm"
                          name="discount"
                          className='w-25'
                          disabled={!editFileds?.discount}
                          value={product?.discount || ''}
                          onChange={(e) => handleEdit(e)}
                        />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            if (!product?.discountPrice && product?.price) {
                              setProduct(prev => ({
                                ...prev,
                                discountPrice: Math.round(prev.price * 0.9)
                              }))
                            }
                          }}
                        >
                          Set Sale
                        </Button>
                      </div>
                    </Form>
                  </Col>
                  <Col md={6} className="mt-2">
                    <Form.Label className="form-label text-muted small">Stock</Form.Label>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Form.Control
                          type="number"
                          name="stock"
                          size="sm"
                          className='w-25'
                          value={product?.stock || ''}
                          disabled={!editFileds.stock}
                          onChange={(e) => handleEdit(e)}
                        />
                        <small className="text-muted">/ {maxStock}</small>
                      </div>
                      <div className="progress mb-1" style={{ height: '8px' }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(product?.stock / maxStock) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row className="g-3">
              <Col lg={3} md={6} >
                <Card className="text-center">
                  <Card.Body className="py-3">
                    <small className="text-muted">Sold</small>
                    <div className="h5 text-primary mb-0">{product?.sold}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} >
                <Card className="text-center">
                  <Card.Body className="py-3">
                    <small className="text-muted">View</small>
                    <div className="h5 text-success mb-0">100</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} >
                <Card className="text-center" onClick={handleNavigate}>
                  <Card.Body className="py-3">
                    <small className="text-muted">Score</small>
                    <div className="h5 text-warning mb-0">{product?.avgScore}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} >
                <Card className="text-center">
                  <Card.Body className="py-3">
                    <small className="text-muted">Doanh thu</small>
                    <div className="h6 text-info mb-0">
                      {(product?.soldCount * product?.price) || 0}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Card className="card">
          <Card.Body className="card-body">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {keys?.map((key, index) => {
                return (
                  <Tab eventKey={key} key={index} title={toReadAble(key)}>
                    <Row>
                      {Object?.entries(product[key]).map(([childKey, value]) => {
                        if (childKey === "dimensions") {
                          return (
                            <Col md={6}>
                              <div className="d-flex justify-content-between py-2 border-bottom">
                                <span className="fw-medium text-muted">Dimensions:</span>
                                <span>{childKey?.length} - {childKey?.width} - {childKey?.thickness}</span>
                              </div>
                            </Col>
                          )
                        }
                        return (
                          <Col md={6}>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span className="fw-medium text-muted">{toReadAble(childKey)}:</span>
                              <input
                                name={`${key}.${childKey}`}
                                value={value}
                                disabled={!editFileds[`${key}.${childKey}`]}
                                onChange={(e) => handleEdit(e)}
                              />
                            </div>
                          </Col>
                        )
                      })}
                    </Row>
                  </Tab>
                )
              })}
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div >
  )
}