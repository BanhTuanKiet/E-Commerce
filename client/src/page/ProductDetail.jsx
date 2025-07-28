import axios from '../util/AxiosConfig'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Accordion } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getObject, toReadAble } from '../util/DataClassify'
import ProductPolicy from '../component/ProductPolicy'

const ProductDetail = () => {
    const { category, id } = useParams()
    const [product, setProduct] = useState(null)
    const [otherOptions, setOtherOptions] = useState()
    const [objectKeys, setObjectKeys] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`/products/detail/${id}`)
                setProduct(response.data)
                setObjectKeys(getObject(response.data))
            } catch (error) {
                console.log(error)
            }
        }

        fetchProductDetail()
    }, [id, setObjectKeys])

    useEffect(() => {
        const fetchOtherOptions = async () => {
            try {
                const response = await axios.get(`/products/other_options/${product?.model}`)
                console.log(response.data)
                setOtherOptions(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (product === null) return
        fetchOtherOptions()
    }, [category, id, product])

    const handleAddtoCart = async () => {
        try {
            await axios.post(`/carts`, { productId: product?._id })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container fluid className="min-vh-100 py-4 px-0 w-75 mx-auto">
            <Container>
                <Row>
                    <Col md={9}>
                        <Row >
                            <Col lg={5} className="px-0">
                                <div className="text-center mb-3 position-relative">
                                    <img
                                        src={product?.images[0]}
                                        alt="Product"
                                        className="img-fluid"
                                        style={{ maxHeight: '250px', objectFit: 'contain' }}
                                    />
                                    {product?.discount > 0 && (
                                        <Badge
                                            bg="danger"
                                            className="position-absolute top-0 start-0 m-2 px-2 py-1"
                                            style={{
                                                zIndex: 10,
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            -{product?.discount}%
                                        </Badge>
                                    )}
                                </div>
                            </Col>

                            <Col lg={7} className='text-start'>
                                {category === 'Phone' ? (
                                    <>
                                        <h1 className="h5 fw-bold mb-3 text-dark">
                                            {product?.model} / {product?.ram} / {product?.storage}
                                        </h1>
                                        <div className='my-2'>
                                            {otherOptions?.map((item, index) => (
                                                <Button
                                                    key={index}
                                                    variant={item?._id === product?._id ? "primary" : "outline-primary"}
                                                    className="me-3 mb-2"
                                                    onClick={() => {
                                                        if (item?._id !== product?._id) {
                                                            navigate(`/${category}/${item._id}`);
                                                        }
                                                    }}
                                                >
                                                    {item?.ram} - {item?.storage}
                                                </Button>
                                            ))}
                                        </div>
                                    </>
                                ) : category === 'laptops' ? (
                                    <h1 className="h5 fw-bold mb-2 text-dark">
                                        {product?.model}
                                    </h1>
                                ) : (
                                    <></>
                                )}
                                <span className="text-muted small d-block mb-3">
                                    Thương hiệu: <strong>{product?.brand}</strong>
                                </span>

                                <div className="my-2">
                                    <h2 className="display-6 text-primary fw-bold mb-0">
                                        {product?.price && (
                                            <>
                                                {product.discount > 0
                                                    ? `${(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}₫`
                                                    : `${product.price.toLocaleString('vi-VN')}₫`
                                                }
                                            </>
                                        )}
                                    </h2>
                                    {product?.discount > 0 && (
                                        <small className="text-muted text-decoration-line-through me-2">
                                            {product.price.toLocaleString('vi-VN')}₫
                                        </small>
                                    )}
                                    <small className="text-muted">Đã bao gồm VAT</small>
                                </div>

                                <Row className="g-3 my-2">
                                    <Col md={6}>
                                        <Button variant="primary" size="lg" className="w-100 text-uppercase fw-semibold py-2">
                                            <i className="fas fa-shopping-cart me-2"></i> Buy
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button variant="outline-primary" size="lg" className="w-100 text-uppercase fw-semibold py-2"
                                            onClick={handleAddtoCart}
                                        >
                                            <i className="fas fa-plus me-2"></i> Add to cart
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="mt-4 text-start">
                            <Accordion defaultActiveKey="0" flush>
                                {objectKeys?.map((key, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header className="fw-semibold">{toReadAble(key)}</Accordion.Header>
                                        <Accordion.Body>
                                            {Object.entries(product[objectKeys[index]] || {}).map(
                                                ([childKey, childValue], childIdx) => (
                                                    <div key={childIdx} className="mb-2">
                                                        <span className="text-muted">{toReadAble(childKey)}:</span>{' '}
                                                        <span className="fw-medium">
                                                            {childKey === "capacity"
                                                                ? `${childValue} mAh`
                                                                : childKey === "size"
                                                                    ? `${childValue}"`
                                                                    : `${childValue}`
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Row>
                    </Col>

                    {/* Policy Component - Right Side */}
                    <Col md={3}>
                        <div className="sticky-top" style={{ top: '20px' }}>
                            <ProductPolicy category={category} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default ProductDetail