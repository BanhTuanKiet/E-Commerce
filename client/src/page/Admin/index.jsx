import { Tab, Nav, Row, Col } from 'react-bootstrap'
import Profile from '../Profile/Profile'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'
import { useState, useEffect } from 'react'
import ReviewManagement from './ReviewManagement'
import VoucherManagement from './VoucherManagement'
import FilterOptions from './FilterOptions'
import UserManagement from './UserManagement'

export default function AdminDashboard() {
  const hash = window.location.hash?.replace('#', '') || 'info'
  const [activeTab, setActiveTab] = useState(hash)
  const [indexFilter, setIndexFilter] = useState()

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash.replace('#', '') || 'info')
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleTabChange = (key) => {
    window.location.hash = key
    setActiveTab(key)
  }

  return (
    <div className="p-3">
      <Tab.Container activeKey={activeTab}>
        <Row>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile" onClick={() => handleTabChange('info')}>
                  Info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="user" onClick={() => handleTabChange('user')}>
                  User
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="product" onClick={() => handleTabChange('product')}>
                  Product
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order" onClick={() => handleTabChange('order')}>
                  Order
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="review" onClick={() => handleTabChange('review')}>
                  Review
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="voucher" onClick={() => handleTabChange('voucher')}>
                  Voucher
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="filterOptions" onClick={() => handleTabChange('filterOptions')}>
                  Filter Options
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} md={10}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Profile activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="user">
                <UserManagement activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="product">
                <ProductManagement activeTab={activeTab} handleTab={setActiveTab} indexFilter={indexFilter} setIndexFilter={setIndexFilter} />
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <OrderManagement activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="review">
                <ReviewManagement activeTab={activeTab} indexFilter={indexFilter} setIndexFilter={setIndexFilter} />
              </Tab.Pane>
              <Tab.Pane eventKey="voucher">
                <VoucherManagement activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="filterOptions">
                <FilterOptions activeTab={activeTab} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}
