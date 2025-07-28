import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import axios from '../../util/AxiosConfig'
import { formatStateLabel } from "../../util/DataClassify"
import PaginationProducts from '../../component/Pagination'
import StateProductCard from '../../component/Card/StateProductCard'
import ProductDetail from './ProductDetail'

const getStatusBadge = (stock) => {
  if (stock === 0) {
    return <span className="badge bg-danger">Out of stock: {stock}</span>
  }
  if (stock <= 5) {
    return <span className="badge bg-warning">Almost out of stock: {stock}</span>
  }
  return <span className="badge bg-success">In stock: {stock}</span>
}

export default function ProductManagement() {
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

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSelections, setFilterSelections] = useState({
    category: '',
    state: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const stateIcons = {
    total: { icon: "bi bi-boxes", color: "text-primary", label: "Tổng sản phẩm" },
    inStock: { icon: "bi bi-check-circle", color: "text-success", label: "Còn hàng" },
    lowStock: { icon: "bi bi-exclamation-triangle", color: "text-warning", label: "Sắp hết hàng" },
    outOfStock: { icon: "bi bi-x-circle", color: "text-danger", label: "Hết hàng" },
    sale: { icon: "bi bi-tags", color: "text-info", label: "Giảm giá" },
    new: { icon: "bi bi-star", color: "text-secondary", label: "Mới về" }
  }
  const [productId, setProductId] = useState()

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response
        if (Object.keys(filterSelections).length === 0) {
          response = await axios.get(`/products?page=${currentPage}`)
        } else {
          const options = encodeURIComponent(JSON.stringify(filterSelections))
          response = await axios.get(`/products/filter/${options}?page=${currentPage}`)
        }

        setProducts(response.data)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProducts()
  }, [currentPage, filterSelections])

  useEffect(() => {
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
            const icon = stateIcons[key]?.icon || "bi bi-box"
            const color = stateIcons[key]?.color || "text-muted"
            
            return (
              <Col md={3} key={key} className="mb-3">
                <StateProductCard handleFilter={handleFilter} label={key} value={value} icon={icon} color={color} />
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
                    className="form-control ps-5"
                    placeholder="Tìm kiếm theo tên sản phẩm hoặc SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                  <option value="all">All</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3} className="text-md-end">
                <Button>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add product
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
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
                    <tr key={product._id}>
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
                        <span className="">{product?.price?.toLocaleString('vi-VN')}</span>
                      </td>
                      <td className="fw-medium">{formatStateLabel(product?.state)}</td>
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
                        <small className="text-muted">
                          {(product?.createdAt)}
                        </small>
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

            <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}