import { Tab, Nav, Row, Col } from 'react-bootstrap'
import Profile from '../Profile/Profile'
import Order from './Order'
import { useEffect, useState } from 'react'
import Review from './Review'

export default function CustomerDashboard() {
  const hash = window.location.hash?.replace('#', '') || 'info'
  const [activeTab, setActiveTab] = useState(hash)

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
                <Nav.Link eventKey="info" onClick={() => handleTabChange('info')}>
                  Info
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
            </Nav>
          </Col>

          <Col xs={12} md={10}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Profile activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <Order activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="review">
                <Review />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}