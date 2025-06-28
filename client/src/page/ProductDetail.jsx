import axios from '../util/AxiosConfig';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Accordion } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getObject } from '../util/DataClassify';

const ProductDetail = () => {
    const { category, id } = useParams();
    const [selectedColor, setSelectedColor] = useState('Bạc');
    const [product, setProduct] = useState();
    const [objectKeys, setObjectKeys] = useState();
    const [quantity, setQuantity] = useState(1);

    const productImages = [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300',
        '/api/placeholder/400/300',
        '/api/placeholder/400/300',
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
    ];

    const [mainImage, setMainImage] = useState(productImages[0]);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`/products/${category}/${id}/detail`);
                setProduct(response.data);
                setObjectKeys(getObject(response.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchProductDetail();
    }, [category, id, setObjectKeys]);

    return (
        <Container fluid className="min-vh-100 py-4 px-0 bg-light">
            <Container>
                <Row>
                    {/* Main content */}
                    <Col md={9}>
                        <Row>
                            {/* Image section */}
                            <Col lg={5} className="mb-4 px-0">
                                <div className="text-center mb-3">
                                    <img
                                        src={mainImage}
                                        alt="Product"
                                        className="img-fluid rounded-4 shadow-sm border"
                                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                </div>
                            </Col>

                            {/* Product info */}
                            <Col lg={7}>
                                <h1 className="h5 fw-bold mb-2 text-dark">
                                    {product?.model} / {product?.ram} / {product?.storage}
                                </h1>
                                <span className="text-muted small d-block mb-3">
                                    Thương hiệu: <strong>{product?.brand}</strong>
                                </span>

                                <div className="mb-4">
                                    <h2 className="display-6 text-primary fw-bold mb-0">29.790.000₫</h2>
                                    <small className="text-muted">Đã bao gồm VAT</small>
                                </div>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Button variant="primary" size="lg" className="w-100 text-uppercase fw-semibold py-2">
                                            <i className="fas fa-shopping-cart me-2"></i> Mua ngay
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button variant="outline-success" size="lg" className="w-100 text-uppercase fw-semibold py-2">
                                            <i className="fas fa-plus me-2"></i> Thêm vào giỏ hàng
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* Product detail accordion */}
                        <Row className="mt-4">
                            <Accordion defaultActiveKey="0" flush>
                                {objectKeys?.map((key, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header className="fw-semibold">{key}</Accordion.Header>
                                        <Accordion.Body>
                                            {Object.entries(product[objectKeys[index]] || {}).map(
                                                ([childKey, childValue], childIdx) => (
                                                    <div key={childIdx} className="mb-2">
                                                        <span className="text-muted">{childKey}:</span>{' '}
                                                        <span className="fw-medium">{childValue?.toString()}</span>
                                                    </div>
                                                )
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Row>
                    </Col>

                    {/* Sidebar */}
                    <Col md={3} className="px-0">
                        <Card className="shadow-sm border-0 rounded-4">
                            <Card.Body className="px-3 py-4">
                                {/* Company Info */}
                                <div className="text-center mb-4">
                                    <h6 className="fw-bold text-uppercase mb-0">Công ty cổ phần thương</h6>
                                    <h6 className="fw-bold text-uppercase text-success">Mại dịch vụ phong vũ</h6>
                                    <Badge bg="success" className="rounded-circle p-2">
                                        <i className="fas fa-check"></i>
                                    </Badge>
                                </div>

                                {/* Policies */}
                                <div className="mb-4">
                                    <h6 className="fw-semibold mb-3">Chính sách bán hàng</h6>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="text-primary me-3">
                                            <i className="fas fa-truck"></i>
                                        </div>
                                        <div className="small">
                                            <div className="fw-semibold">Miễn phí giao hàng cho đơn hàng từ 5 triệu</div>
                                            <a href="#" className="text-primary text-decoration-none">Xem chi tiết</a>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="text-primary me-3">
                                            <i className="fas fa-shield-alt"></i>
                                        </div>
                                        <div className="small">
                                            <div className="fw-semibold">Cam kết hàng chính hãng 100%</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="text-primary me-3">
                                            <i className="fas fa-undo"></i>
                                        </div>
                                        <div className="small">
                                            <div className="fw-semibold">Đổi trả trong vòng 10 ngày</div>
                                            <a href="#" className="text-primary text-decoration-none">Xem chi tiết</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Extra Services */}
                                <div>
                                    <h6 className="fw-semibold mb-3">Dịch vụ khác</h6>
                                    <div className="d-flex align-items-start">
                                        <div className="text-primary me-3">
                                            <i className="fas fa-cog"></i>
                                        </div>
                                        <div className="small">
                                            <div className="fw-semibold">Gói dịch vụ bảo hành/ Sửa chữa tận nơi</div>
                                            <a href="#" className="text-primary text-decoration-none">Xem chi tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default ProductDetail;
