import { Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../../style/MostPurchased.css"

export default function MostPurchasedProductCard({ product }) {
  const navigate = useNavigate()

  if (!product) {
    return (
      <div className="not-found-card">
        <p className="not-found-text">Không có sản phẩm mua nhiều nhất để hiển thị.</p>
      </div>
    )
  }

  const salePrice = product.price * (1 - product.discount / 100)
  const saveAmount = product.price - salePrice

  return (
    <div
      className="flip-card"
      onClick={() =>
        navigate(`/${product.category.toLowerCase()}s/${product._id}`)
      }
    >
      <div className="flip-card-inner">
        {/* Mặt trước của card */}
        <div className="flip-card-front">
          <div className="card-image-container">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.model}
              className="card-image"
            />
            <Badge bg="warning" className="best-seller-badge">
              <i className="bi bi-star-fill"></i> Best Seller
            </Badge>
          </div>
          <div className="card-info">
            <h5 className="product-title">{product.model}</h5>
            <div className="product-price">
              <span className="original-price">
                {product.price.toLocaleString()}₫
              </span>
              <span className="sale-price">
                {salePrice.toLocaleString()}₫
              </span>
            </div>
          </div>
        </div>
        {/* Mặt sau của card */}
        <div className="flip-card-back">
          <div className="card-back-content">
            <h5 className="product-title">{product.model}</h5>
            <p className="product-price-detail">
              Tiết kiệm: {saveAmount.toLocaleString()}₫
            </p>
            <Badge bg="danger" className="discount-badge">
              {product.discount}% OFF
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
