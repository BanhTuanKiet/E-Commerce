import { useState } from "react"
import { Container, Row, Col, Card, Table, Button, Form, Badge, ButtonGroup, Alert } from "react-bootstrap"
import { Search, Eye, BarChart3, List } from "lucide-react"
import { useEffect } from "react"
import axios from "../../config/AxiosConfig"
import { renderStars } from "../../util/BadgeUtil"
import PaginationProducts from "../../component/Pagination"
import ReviewDetail from "./ReviewDetail"
import NotFoundSearch from "../../component/NotFoundSearch"

export default function ReviewManagement({ activeTab,  indexFilter, setIndexFilter }) {
  const [reviewId, setReviewId] = useState()
  const [reviews, setReviews] = useState()
  const [categories, setCategories] = useState()
  const [productAverages, setProductAverages] = useState()
  const [viewMode, setViewMode] = useState("individual")
  const [filterSelections, setFilterSelections] = useState({})
  const [totalPages, setTotalPages] = useState(2)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (activeTab !== "review") return
    setFilterSelections({})
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "review") return
    if (indexFilter) setFilterSelections(indexFilter)
  }, [activeTab, viewMode])

  useEffect(() => {
    if (activeTab !== "review") return
    if (viewMode !== "average") return
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/categories`)
        setCategories(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [activeTab, viewMode])

  useEffect(() => {
    if (activeTab !== 'review') return
    if (viewMode === "individual") {
      fetchReviews()
    }
    if (viewMode === "average") {
      fetchProductAverages()
    }
  }, [filterSelections, currentPage, viewMode, activeTab])

  const fetchReviews = async () => {
    try {
      const options = encodeURIComponent(JSON.stringify(filterSelections))
      const response = await axios.get(`/reviews/filter?options=${options}&page=${currentPage}`)
      setReviews(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProductAverages = async () => {
    try {
      const options = encodeURIComponent(JSON.stringify(filterSelections))
      const response = await axios.get(`/products/filter?options=${options}&page=${currentPage}`)
      setProductAverages(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilter = (e) => {
    const { name, value } = e.target

    setFilterSelections((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setCurrentPage(1)
  }

  if (reviewId) {
    return <ReviewDetail reviewId={reviewId} setReviewId={setReviewId} />
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Review management</h1>
            <p className="text-muted">Manage and moderate product reviews</p>
          </div>
          <div className="d-flex gap-2">
            <ButtonGroup>
              <Button
                variant={viewMode === "individual" ? "primary" : "outline-primary"}
                onClick={() => handleViewModeChange("individual")}
              >
                <List size={16} className="me-2" />
                Personal review
              </Button>
              <Button
                variant={viewMode === "average" ? "primary" : "outline-primary"}
                onClick={() => handleViewModeChange("average")}
              >
                <BarChart3 size={16} className="me-2" />
                Average product rating
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <Card className="mb-4">
          <Card.Header>
            <Row>
              <Col md={6}>
                <div className="position-relative">
                  <Search
                    size={16}
                    className="position-absolute text-muted"
                    style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <Form.Control
                    type="text"
                    placeholder={
                      viewMode === "individual"
                        ? "Search by customer or model product..."
                        : "Search by model product..."
                    }
                    name="searchTerm"
                    value={filterSelections?.searchTerm || ""}
                    onChange={(e) => handleFilter(e)}
                    style={{ paddingLeft: "40px" }}
                  />
                </div>
              </Col>
              {viewMode === "individual" && (
                <>
                  <Col md={3}>
                    <Form.Select name="isFlagged" value={filterSelections?.isFlagged || ""} onChange={(e) => handleFilter(e)}>
                      <option value="">All</option>
                      <option value="false">Verified</option>
                      <option value="true">Unverified</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select name="rating" value={filterSelections?.rating || ""} onChange={(e) => handleFilter(e)}>
                      <option value="">All</option>
                      <option value="1">⭐ 1</option>
                      <option value="2">⭐ 2</option>
                      <option value="3">⭐ 3</option>
                      <option value="4">⭐ 4</option>
                      <option value="5">⭐ 5</option>
                    </Form.Select>
                  </Col>
                </>
              )}
              {viewMode === "average" && (
                <>
                  <Col md={3}>
                    <Form.Select value={filterSelections?.category} onChange={(e) => handleFilter(e)} name="category">
                      <option value="">All category</option>
                      {categories?.map(c => (
                        <option key={c?._id} value={c.name}>{c.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select name="sortBy" value={filterSelections?.sortBy} onChange={(e) => handleFilter(e)}>
                      <option value="">Sort by</option>
                      <option value="desc">Highest rated</option>
                      <option value="asc">Lowest rated</option>
                    </Form.Select>
                  </Col>
                </>
              )}
            </Row>
          </Card.Header>
        </Card>

        <Card>
          {!reviews?.length
            ? <NotFoundSearch type={'review'} onClear={() => setFilterSelections({})} />
            : <Card.Body className="p-0">
              {reviews?.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <div className="fs-1 mb-3">🏷️</div>
                  <h5>Review not found</h5>
                  <p>Try changing filters or searching for keywords</p>
                </Alert>
              ) : (
                <>
                  {viewMode === "individual" ? (
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>Review</th>
                          <th>Status</th>
                          <th>Created at</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews?.map((review) => (
                          <tr key={review._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="fw-medium">{review?.userId.name}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="fw-medium">{review.productId.model}</span>
                              </div>
                            </td>
                            <td>{renderStars(review.rating)}</td>
                            <td>
                              {!review.isFlagged ? (
                                <Badge bg="success" className="small">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge bg="danger" className="small">
                                  Unverified
                                </Badge>
                              )}
                            </td>
                            <td className="small">
                              <div className="small">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</div>
                              <div className="small text-muted">
                                {new Date(review.createdAt).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <Button variant="outline-secondary" size="sm" onClick={() => setReviewId(review?._id)}>
                                  <Eye size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Index</th>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Average Rating</th>
                          <th>Total Ratings</th>
                          <th>Ratings</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productAverages?.map((product, index) => (
                          <tr key={product?._id}>
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
                            <td className="">
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="fw-medium">{product?.model}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {renderStars(Math.round(product?.avgScore))}
                              </div>
                            </td>
                            <td>
                              <span className="fw-medium">{product?.reviews}</span>
                            </td>
                            <td>
                              {product?.avgScore >= 4.0 ? (
                                <Badge bg="success" className="small">
                                  Highly rated
                                </Badge>
                              ) : (
                                <Badge bg="danger" className="small">
                                  Needs improvement
                                </Badge>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => {
                                    setViewMode("individual")
                                    setFilterSelections({
                                      searchTerm: product?.model
                                    })
                                  }}
                                >
                                  <Eye size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              )}
              <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </Card.Body>
          }
        </Card>
      </Container>
    </div>
  )
}
