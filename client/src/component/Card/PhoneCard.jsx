import { Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

export default function PhoneCard({ product, keys }) {
  const { category } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-2 pt-0 py-3">
      <Card
        className="border-1 h-100 position-relative overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '14rem',
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Badge cho sản phẩm mới */}
        <div
          className="position-absolute top-0 start-0 badge bg-primary text-white m-2 px-2 py-1"
          style={{
            zIndex: 10,
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}
        >
          New
        </div>

        {/* Container hình ảnh với overlay gradient */}
        <div className="position-relative overflow-hidden p-3" style={{ borderRadius: '16px 16px 0 0' }}>
          {/* <div className='p-2'> */}
          <Card.Img
            variant="top"
            src={product?.images?.[0] || "https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg"}
            alt={product?.model}
            style={{
              height: '220px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out'
            }}
            onClick={() => navigate(`/${category}/${product?._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />
          {/* </div> */}

          {/* Gradient overlay */}
        </div>

        <Card.Body className="p-3">
          {/* Tên sản phẩm với typography cải tiến */}
          <Card.Title
            className="fs-6 text-start fw-bold mb-2 text-truncate"
            style={{
              color: '#2c3e50',
              lineHeight: '1.3',
              letterSpacing: '-0.01em'
            }}
            title={product?.model}
          >
            {product?.model}
          </Card.Title>

          {/* Thông tin chi tiết với design cải tiến */}
          <div className="mb-3">
            {keys && keys.map((key) => {
              if (key === 'model' || key === '_id') return null

              const value = product[key]
              return (
                <div
                  key={key}
                  className="d-flex justify-content-between align-items-center py-1 border-bottom"
                  style={{
                    borderBottomColor: '#f8f9fa !important',
                    borderBottomWidth: '1px',
                    fontSize: '0.85rem'
                  }}
                >
                  <span
                    className="text-muted fw-medium"
                    style={{ color: '#6c757d' }}
                  >
                    {formatLabel(key)}
                  </span>
                  <span
                    className="fw-semibold text-end"
                    style={{
                      color: '#495057',
                      maxWidth: '60%',
                      wordBreak: 'break-word'
                    }}
                  >
                    {formatValue(value)}
                  </span>
                </div>
              )
            })}

          </div>

          {/* Giá tiền với design nổi bật */}
          {product?.price && (
            <div
              className="mt-3 p-3 text-center fw-bold position-relative"
              style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  borderRadius: '12px'
                }}
              />
              <span className="position-relative">
                {product[keys.price].toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

function formatLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function formatValue(value) {
  if (value == null || value === '') return 'N/A'
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && value.length > 20) {
    return value.substring(0, 17) + '...'
  }
  return value
}