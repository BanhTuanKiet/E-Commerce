import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, ProgressBar, Row, Tab, Table, Tabs } from 'react-bootstrap'
import axios from '../../util/AxiosConfig'
import { toReadAble, getObject } from '../../util/DataClassify'

const maxStock = 100

const productDetail = {
    id: "1",
    name: "iPhone 15 Pro Max",
    category: "Điện thoại",
    brand: "Apple",
    price: 29990000,
    originalPrice: 32990000,
    stock: 25,
    status: "active",
    images: [
        "https://via.placeholder.com/400x400/f8f9fa/6c757d?text=iPhone+15+Pro+Max+Front",
        "https://via.placeholder.com/400x400/f8f9fa/6c757d?text=iPhone+15+Pro+Max+Back",
        "https://via.placeholder.com/400x400/f8f9fa/6c757d?text=iPhone+15+Pro+Max+Side",
        "https://via.placeholder.com/400x400/f8f9fa/6c757d?text=iPhone+15+Pro+Max+Box",
    ],
    sku: "IP15PM-256-TI",
    barcode: "1234567890123",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-25",
    lastRestocked: "2024-01-20",
    isOnSale: true,
    salePercentage: 9,
    soldCount: 45,
    viewCount: 1250,
    rating: 4.8,
    reviewCount: 23,
    minStock: 10,
    maxStock: 100,
    weight: "221g",
    dimensions: "159.9 x 76.7 x 8.25 mm",
    description:
        "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp và thiết kế titan cao cấp. Màn hình Super Retina XDR 6.7 inch với ProMotion và Always-On display.",
    specifications: {
        "Màn hình": "6.7 inch Super Retina XDR OLED",
        Chip: "A17 Pro",
        Camera: "48MP + 12MP + 12MP",
        RAM: "8GB",
        "Bộ nhớ": "256GB",
        Pin: "4441mAh",
        "Hệ điều hành": "iOS 17",
        "Màu sắc": "Titan Tự Nhiên",
    },
    stockHistory: [
        { date: "2024-01-25", type: "import", quantity: 20, note: "Nhập hàng định kỳ", balance: 25 },
        { date: "2024-01-23", type: "export", quantity: -3, note: "Bán lẻ", balance: 5 },
        { date: "2024-01-22", type: "export", quantity: -2, note: "Bán online", balance: 8 },
        { date: "2024-01-20", type: "import", quantity: 15, note: "Nhập bổ sung", balance: 10 },
        { date: "2024-01-18", type: "export", quantity: -5, note: "Bán buôn", balance: -5 },
    ],
    salesData: [
        { month: "T1", sales: 12 },
        { month: "T2", sales: 18 },
        { month: "T3", sales: 25 },
        { month: "T4", sales: 15 },
        { month: "T5", sales: 32 },
        { month: "T6", sales: 28 },
    ],
}

const getStatusBadge = (status, stock) => {
    if (status === "outOfStock") {
        return <span className="badge bg-danger">Out of stock</span>
    }
    if (status === "lowStock") {
        return <span className="badge bg-warning">Low stock</span>
    }
    return <span className="badge bg-success">In stock</span>
}

export default function ProductDetail({ productId, setProductId }) {
    const [product, setProduct] = useState()
    const [activeTab, setActiveTab] = useState("overview")
    const [keys, setKeys] = useState()

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

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center">
                        <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => setProductId(undefined)}>
                            Back
                        </button>
                        <div>
                            <h1 className="h2 mb-1">{product?.model}</h1>
                            <p className="text-muted">Product details and management information</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant='outline-primary'>
                            Edit
                        </Button>
                        <Button variant='danger'>
                            Delete
                        </Button>
                    </div>
                </div>

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
                                {getStatusBadge(product?.state, product?.stock)}
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
                                        <label className="form-label text-muted small">Model</label>
                                        <div><code>{product?.model}</code></div>
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
                                        <label className="form-label text-muted small">Price</label>
                                        <div>
                                            <div className="h4 text-success mb-1">
                                                {(product?.price * (1 - (product?.discount / 100))).toLocaleString('vi-VN')}
                                            </div>
                                            {product?.discount && product?.state === 'sale' && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="text-muted text-decoration-line-through">
                                                        {product?.price.toLocaleString('vi-VN')}
                                                    </small>
                                                    <span className="badge bg-danger">
                                                        -{product.discount}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6} className='mt-2' >
                                        <label className="form-label text-muted small">Stock</label>
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className="h4 mb-0">{product?.stock}</span>
                                                <small className="text-muted">/ {maxStock}</small>
                                            </div>
                                            <div className="progress mb-1" style={{ height: '8px' }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${(product?.stock / maxStock) * 100}%` }}
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
                                        <small className="text-muted">Đã bán</small>
                                        <div className="h5 text-primary mb-0">{productDetail.soldCount}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} >
                                <Card className="text-center">
                                    <Card.Body className="py-3">
                                        <small className="text-muted">Lượt xem</small>
                                        <div className="h5 text-success mb-0">{productDetail.viewCount}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} >
                                <Card className="text-center">
                                    <Card.Body className="py-3">
                                        <small className="text-muted">Đánh giá</small>
                                        <div className="h5 text-warning mb-0">{productDetail.rating}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} >
                                <Card className="text-center">
                                    <Card.Body className="py-3">
                                        <small className="text-muted">Doanh thu</small>
                                        <div className="h6 text-info mb-0">
                                            {(productDetail.soldCount * productDetail.price)}
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
                                                            <span>{value}</span>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Tab>
                                )
                            })}

                            {/* <Tab eventKey="inventory" title="Kho hàng">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Lịch sử xuất nhập kho</h5>
                                    <Button variant="outline-primary" size="sm">Nhập hàng</Button>
                                </div>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>Ngày</th>
                                                <th>Loại</th>
                                                <th>Số lượng</th>
                                                <th>Ghi chú</th>
                                                <th>Tồn kho</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productDetail.stockHistory.map((record, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(record.date).toLocaleDateString("vi-VN")}</td>
                                                    <td>
                                                        <Badge bg={record.type === "import" ? "primary" : "secondary"}>
                                                            {record.type === "import" ? "Nhập" : "Xuất"}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <span className={`fw-medium ${record.quantity > 0 ? "text-success" : "text-danger"}`}>
                                                            {record.quantity > 0 ? "+" : ""}
                                                            {record.quantity}
                                                        </span>
                                                    </td>
                                                    <td>{record.note}</td>
                                                    <td className="fw-medium">{record.balance}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab> */}

                            <Tab eventKey="analytics" title="Phân tích">
                                <h5 className="mb-3">Phân tích bán hàng</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Card>
                                            <Card.Header>
                                                <h6 className="mb-0">Doanh số 6 tháng gần đây</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                {productDetail.salesData.map((data, index) => (
                                                    <div key={index} className="d-flex align-items-center mb-2">
                                                        <span className="small me-3" style={{ minWidth: '30px' }}>{data.month}</span>
                                                        <ProgressBar
                                                            now={(data.sales / 35) * 100}
                                                            className="flex-grow-1 me-3"
                                                            style={{ height: '20px' }}
                                                        />
                                                        <span className="small fw-medium" style={{ minWidth: '30px' }}>{data.sales}</span>
                                                    </div>
                                                ))}
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <div className="col-md-6">
                                        <Card>
                                            <Card.Header>
                                                <h6 className="mb-0">Thống kê tương tác</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="small text-muted">Tỷ lệ chuyển đổi</span>
                                                    <span className="fw-semibold">3.6%</span>
                                                </div>
                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="small text-muted">Lượt xem trung bình/ngày</span>
                                                    <span className="fw-semibold">42</span>
                                                </div>
                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="small text-muted">Đánh giá trung bình</span>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <span className="fw-semibold">{productDetail.rating}</span>
                                                        <small className="text-muted">({productDetail.reviewCount})</small>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="small text-muted">Vòng quay kho</span>
                                                    <span className="fw-semibold">2.1 lần/tháng</span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        </div >
    )
}