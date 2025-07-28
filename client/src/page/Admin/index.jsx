import React from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from '../Profile/Profile';
import ProductManagement from './ProductManagement';

export default function AdminDashboard() {
  return (
    <div className="p-3">
      <Tab.Container defaultActiveKey="info">
        <Row>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="product">Product</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order">Order</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="review">Review</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} md={10}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <Profile />
              </Tab.Pane>
              <Tab.Pane eventKey="product">
                <ProductManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <h4>Order Management</h4>
                <p>Quản lý đơn hàng...</p>
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
  );
}
