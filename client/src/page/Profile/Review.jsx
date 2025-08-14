import { Col, Container, Row, Accordion, ListGroup, Badge } from 'react-bootstrap';

export default function Review() {
  const orders = [
    {
      orderId: '123',
      products: [
        { id: 'p1', name: 'Product A', status: 'Has reply' },
        { id: 'p2', name: 'Product B', status: 'Pending' },
      ]
    },
    {
      orderId: '124',
      products: [
        { id: 'p3', name: 'Product C', status: 'Not reviewed' },
      ]
    }
  ];

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="border-end bg-light vh-100 p-0">
          <h5 className="p-3 border-bottom">My Orders</h5>
          <Accordion alwaysOpen>
            {orders.map((order, idx) => (
              <Accordion.Item eventKey={String(idx)} key={order.orderId}>
                <Accordion.Header>Order #{order.orderId}</Accordion.Header>
                <Accordion.Body className="p-0">
                  <ListGroup variant="flush">
                    {order.products.map(product => (
                      <ListGroup.Item
                        action
                        key={product.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {product.name}
                        <Badge bg={
                          product.status === 'Has reply' ? 'success' :
                          product.status === 'Pending' ? 'warning' : 'secondary'
                        }>
                          {product.status}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        {/* Main content */}
        <Col md={9} className="p-4">
          <h4>Review & Chat Box</h4>
          <p>Select a product from the sidebar to view or write your review.</p>
        </Col>
      </Row>
    </Container>
  );
}
