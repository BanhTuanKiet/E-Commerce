import { Tab, Nav, Row, Col } from 'react-bootstrap'
import Profile from '../Profile/Profile'
import OrderManagement from './Order'
import { useState } from 'react'

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('info')

  return (
    <div className="p-3">
      <Tab.Container activeKey={activeTab}>
        <Row>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="info" onClick={() => setActiveTab('info')}>
                  Info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order" onClick={() => setActiveTab('order')}>
                  Order
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="review" onClick={() => setActiveTab('review')}>
                  Review
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} md={10}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Profile activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <OrderManagement activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="review">
                <h4>Review Management</h4>
                <p>Quản lý đánh giá...</p>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}