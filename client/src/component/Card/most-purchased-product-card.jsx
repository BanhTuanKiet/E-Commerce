import { Card, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function MostPurchasedProductCard({ product }) {
  const navigate = useNavigate()

  if (!product) {
    return (
      <Card className="w-100 h-100 bg-white rounded-4 shadow-lg d-flex flex-column justify-content-center align-items-center p-3">
        <Card.Body className="text-center">
          <p className="text-muted">Không có sản phẩm mua nhiều nhất để hiển thị.</p>
        </Card.Body>
      </Card>
    )
  }

  const salePrice = product.price * (1 - product.discount / 100)

  return (
    <Card
      className="w-100 h-100 bg-white rounded-4 shadow-lg d-flex flex-column justify-content-between p-4 cursor-pointer most-purchased-card"
      onClick={() => navigate(`/${product.category.toLowerCase()}s/${product._id}`)}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center flex-grow">
        <Badge bg="warning" className="mb-3 px-4 py-2 text-dark fw-bold" style={{ fontSize: "0.8rem" }}>
          <i className="bi bi-star-fill me-2"></i>SẢN PHẨM BÁN CHẠY NHẤT
        </Badge>
        <div
          className="position-relative w-100 d-flex align-items-center justify-content-center mb-3"
          style={{ height: "160px" }}
        >
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.model}
            className="img-fluid"
            style={{ maxHeight: "150px", objectFit: "contain" }}
          />
        </div>
        <Card.Title className="mb-2 fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
          {product.model}
        </Card.Title>
        <Card.Text className="text-muted small mb-2">
          Giá gốc: <span className="text-decoration-line-through">{product.price.toLocaleString()}₫</span>
        </Card.Text>
        <div className="d-flex flex-column align-items-center">
          <Card.Text className="text-danger fw-bolder mb-1" style={{ fontSize: "1.5rem" }}>
            {salePrice.toLocaleString()}₫
          </Card.Text>
          <Badge bg="danger" className="px-3 py-2" style={{ fontSize: "0.7rem" }}>
            TIẾT KIỆM {(product.price - salePrice).toLocaleString()}₫
          </Badge>
        </div>
      </Card.Body>
    </Card>
  )
}
