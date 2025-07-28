import { Card, Badge } from "react-bootstrap"

export default function SaleProductCard({ product, keys }) {
    const salePrice = product.price * (1 - product.discount / 100)
    const savings = product.price - salePrice

    return (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100">
            <div className="position-absolute top-0 start-0 m-2">
                <Badge bg="danger" className="rounded-pill px-2 py-1 fs-7">
                    SALE {product.discount}%
                </Badge>
            </div>

            <div className="position-absolute top-0 end-0 m-2">
                <Badge bg="primary" className="text-white rounded px-2 py-1 fs-7">
                    0% INST
                </Badge>
            </div>

            <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: 150 }}>
                <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="img-fluid p-2"
                    style={{ maxHeight: "100%", objectFit: "contain" }}
                />
            </div>

            <Card.Body className="pt-2 pb-3 px-3 d-flex flex-column justify-content-between">
                <div className="mb-2 d-flex flex-wrap gap-1">
                    {keys?.map((key, idx) => {
                        if (['model', '_id', 'price', 'discount', 'stock', 'category', 'images', 'state', 'reviews'].includes(key)) return null
                        const num = Math.floor(Math.random() * 3)
                        return (
                            <span
                                key={idx}
                                className="badge rounded-0 fst-normal"
                                style={{
                                    color: num === 0
                                        ? "#28a745"
                                        : num === 1
                                            ? "#856404"
                                            : num === 2
                                                ? "#721c24"
                                                : "#000",
                                    backgroundColor: num === 0
                                        ? "#d4edda"
                                        : num === 1
                                            ? "#fff3cd"
                                            : num === 2
                                                ? "#f8d7da"
                                                : "#dee2e6"
                                }}
                            >
                                {product[key]}
                            </span>

                        )
                    })}
                </div>


                <Card.Title className="fw-semibold text-truncate fs-6" style={{ maxHeight: "2.5em" }}>
                    {product?.model}
                </Card.Title>

                <div className="mb-2">
                    <div className="d-flex align-items-baseline gap-2">
                        <span className="text-danger fw-bold fs-5">{salePrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>

                <span className="badge text-bg-danger bg-danger bg-opacity-75">Savings: {savings.toLocaleString('vi-VN')}</span>
            </Card.Body>
        </Card>
    )
}