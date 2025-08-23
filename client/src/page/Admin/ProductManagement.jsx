import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import axios from '../../util/AxiosConfig'
import PaginationProducts from '../../component/Pagination'
import StatusItemCard from '../../component/Card/StatusItemCard'
import ProductDetail from './ProductDetail'
import { getProductState, getStatusBadge } from '../../util/BadgeUtil'
import AddModal from '../../component/Modal/AddModal'
import NotFoundSearch from '../../component/NotFoundSearch'

export default function ProductManagement({ activeTab }) {
  const [categories, setCategories] = useState()
  const [products, setProducts] = useState()
  const [productStates, setProductStates] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    sale: 0,
    new: 0
  })
  const timeoutSearchProductRef = useRef(null)
  const [filterSelections, setFilterSelections] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [productId, setProductId] = useState()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (activeTab !== "product") return

    setFilterSelections({
      category: '',
      state: ''
    })
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "product") return
    if (timeoutSearchProductRef.current) {
      clearTimeout(timeoutSearchProductRef.current)
    }

    timeoutSearchProductRef.current = setTimeout(async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/products/filter?options=${options}`)
        setProducts(response.data)
        setCurrentPage(1)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }, [activeTab, filterSelections])

  useEffect(() => {
    if (activeTab !== "product") return

    const fetchProducts = async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/products/filter?options=${options}&page=${currentPage}`)
        setProducts(response.data)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProducts()
  }, [activeTab, currentPage])

  useEffect(() => {
    const fetchCategories = async () => {
      if (activeTab !== "product") return

      try {
        const response = await axios.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "product") return

    const fetchProductStates = async () => {
      try {
        const responses = await Promise.all(
          Object.entries(productStates).map(([key, value]) => {
            return axios.get(`/products/state/count/${key}`)
          })
        )

        const newStates = {}
        let total = 0
        responses.forEach(({ key, data }) => {
          newStates[key] = data
          total += data
        })

        newStates["total"] = total

        setProductStates(prev => ({ ...prev, ...newStates }))
      } catch (error) {
        console.log(error)
      }
    }

    fetchProductStates()
  }, [])

  const handleFilter = (key, value) => {
    setFilterSelections({ ...filterSelections, [key]: value })
  }

  if (productId) {
    return <ProductDetail productId={productId} setProductId={setProductId} />
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="py-4 pt-0">
        <Row className="mb-4">
        </Row>

        <Row>
          <Col md={6} >
            <h1 className="display-5 fw-bold text-dark">Product managemnet</h1>
            <p className="text-muted">Manage your store's product list</p>
          </Col>
          {Object?.entries(productStates)?.map(([key, value]) => {
            const isActive = filterSelections.state === key
            
            return (
              <Col md={3} key={key} className="mb-3">
                <StatusItemCard handleFilter={handleFilter} type="product" label={key} value={value} isActive={isActive} />
              </Col>
            )
          })}
        </Row>

        <Card className="h-100">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="text"
                    name='model'
                    className="form-control ps-5"
                    placeholder="Seach by model..."
                    value={filterSelections?.model ?? ""}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  />
                </div>
              </Col>
              <Col md={3}>
                <select
                  className="form-select"
                  name='category'
                  value={filterSelections?.category}
                  onChange={(e) => handleFilter(e.target.name, e.target.value)}
                >
                  <option value="">All</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3} className="text-md-end">
                <Button onClick={() => setShow(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add product
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-0">
            {products?.length === 0 ? (
              <NotFoundSearch type={'product'} onClear={() => setFilterSelections({})} />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Index</th>
                      <th>Image</th>
                      <th>Model</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>State</th>
                      <th>Stock</th>
                      <th>Created at</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product, index) => (
                      <tr key={product._id} className='align-middle'>
                        <td>
                          <div className="fw-medium" style={{ maxWidth: '200px' }}>
                            <div className="text-truncate">{index + 1 + (10 * (currentPage - 1))}</div>
                          </div>
                        </td>
                        <td>
                          <img
                            src={product.images[0]}
                            alt={product.model}
                            width="50"
                            height="50"
                            className="rounded object-fit-cover"
                          />
                        </td>
                        <td>
                          <div className="fw-medium" style={{ maxWidth: '200px' }}>
                            <div className="text-truncate">{product?.model}</div>
                          </div>
                        </td>
                        <td>
                          <small className="badge bg-light text-dark border">{product.category}</small>
                        </td>
                        <td>
                          <span>{product?.price?.toLocaleString('vi-VN')}</span>
                        </td>
                        <td className="fw-medium">{getProductState(product?.state)}</td>
                        <td>
                          <span
                            className={`fw-medium ${product.stock === 0
                              ? "text-danger"
                              : product.stock <= 5
                                ? "text-warning"
                                : "text-success"
                              }`}
                          >
                            {getStatusBadge(product?.stock)}
                          </span>
                        </td>
                        <td>
                          <div className="small">
                            {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="small text-muted">
                            {new Date(product.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant='outline-primary'
                              className="btn-sm"
                              onClick={() => setProductId(product?._id)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Detail
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Card.Body>
        </Card>

        <AddModal show={show} setShow={setShow} />
      </Container>
    </div>
  )
}