import React, { useState, useEffect } from 'react'
import { Carousel, Row, Col } from 'react-bootstrap'
import '../style/CategoryBanner.css'

const CategoryBanner = ({ category }) => {
  const bannerData = {
    Home: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1603899122644-619f6a877d90?w=1200&h=400&fit=crop',
        title: 'Back to School Sale',
        subtitle: 'Giảm đến 30% cho laptop và tablet',
        link: '/promotion/back-to-school'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1587574293340-ec9c404d4b4e?w=1200&h=400&fit=crop',
        title: 'Summer Deals 2025',
        subtitle: 'Sắm điện thoại mới, nhận quà cực chất',
        link: '/promotion/summer-deals'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1606813909401-5b51e764bf0a?w=1200&h=400&fit=crop',
        title: 'Headphones & Audio Sale',
        subtitle: 'Giảm sốc tai nghe Sony, JBL, Bose',
        link: '/promotion/audio-sale'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1609943243050-8b740b02c1b0?w=1200&h=400&fit=crop',
        title: 'Flash Sale Mỗi Ngày',
        subtitle: 'Deal siêu hot chỉ trong hôm nay!',
        link: '/flash-sale'
      }
    ],
    Phone: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=300&fit=crop',
        title: 'iPhone 15 Series',
        subtitle: 'Giảm giá lên đến 20%',
        link: '/promotion/iphone-15'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=300&fit=crop',
        title: 'Samsung Galaxy S24',
        subtitle: 'Công nghệ AI tiên tiến',
        link: '/promotion/galaxy-s24'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=300&fit=crop',
        title: 'Xiaomi Series',
        subtitle: 'Hiệu năng vượt trội',
        link: '/promotion/xiaomi'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=300&fit=crop',
        title: 'Google Pixel',
        subtitle: 'Camera AI thông minh',
        link: '/promotion/pixel'
      }
    ],
    Laptop: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=300&fit=crop',
        title: 'MacBook Air M3',
        subtitle: 'Mỏng nhẹ, hiệu năng mạnh',
        link: '/promotion/macbook-air'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=300&fit=crop',
        title: 'Gaming Laptop',
        subtitle: 'Trải nghiệm game tuyệt vời',
        link: '/promotion/gaming-laptop'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=300&fit=crop',
        title: 'Business Laptop',
        subtitle: 'Dành cho doanh nhân',
        link: '/promotion/business-laptop'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=300&fit=crop',
        title: 'Surface Series',
        subtitle: 'Linh hoạt và sáng tạo',
        link: '/promotion/surface'
      }
    ],
    Tablet: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=300&fit=crop',
        title: 'iPad Pro',
        subtitle: 'Sức mạnh của máy tính',
        link: '/promotion/ipad-pro'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=300&fit=crop',
        title: 'Samsung Galaxy Tab',
        subtitle: 'Đa nhiệm mượt mà',
        link: '/promotion/galaxy-tab'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop',
        title: 'iPad Air',
        subtitle: 'Hiệu năng tối ưu',
        link: '/promotion/ipad-air'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=300&fit=crop',
        title: 'Lenovo Tab',
        subtitle: 'Giải trí không giới hạn',
        link: '/promotion/lenovo-tab'
      }
    ],
    Headphone: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=300&fit=crop',
        title: 'Sony WH-1000XM5',
        subtitle: 'Chống ồn hàng đầu thế giới',
        link: '/promotion/sony-wh1000xm5'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=300&fit=crop',
        title: 'Bose QuietComfort',
        subtitle: 'Thoải mái cả ngày dài',
        link: '/promotion/bose-qc'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop',
        title: 'Apple AirPods Max',
        subtitle: 'Âm thanh sống động',
        link: '/promotion/airpods-max'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=300&fit=crop',
        title: 'JBL Live 660NC',
        subtitle: 'Pin trâu, bass mạnh mẽ',
        link: '/promotion/jbl-live'
      }
    ]
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const banners = bannerData[category] || bannerData.smartphone

  const bannerPairs = []
  for (let i = 0; i < banners?.length; i += 2) {
    bannerPairs.push(banners.slice(i, i + 2))
  }

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerPairs.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Tự động chuyển sau 4 giây

    return () => clearInterval(interval)
  }, [bannerPairs.length])

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex)
  }

  return (
    <div className="category-banner-container mb-4">
      <Carousel
        activeIndex={currentIndex}
        onSelect={handleSelect}
        indicators={true}
        controls={true}
        pause="hover"
        className="category-carousel"
      >
        {bannerPairs.map((pair, index) => (
          <Carousel.Item key={index} className="carousel-item-custom">
            <Row className="g-3">
              {pair.map((banner, bannerIndex) => (
                <Col md={6} key={banner.id}>
                  <div className="banner-card">
                    <div
                      className="banner-image"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '200px',
                        borderRadius: '10px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <div className="banner-content text-center text-white">
                        <h3 className="banner-title mb-2" style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}>
                          {banner.title}
                        </h3>
                        <p className="banner-subtitle mb-0" style={{
                          fontSize: '1rem',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}>
                          {banner.subtitle}
                        </p>
                      </div>

                      {/* Gradient overlay */}
                      <div
                        className="banner-overlay"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                          borderRadius: '10px'
                        }}
                      ></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default CategoryBanner