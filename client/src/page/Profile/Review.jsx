import { useEffect, useRef, useState } from 'react'
import { Col, Container, Row, Accordion, ListGroup } from 'react-bootstrap'
import axios from '../../config/AxiosConfig'
import ReplyComponent from '../../component/ReplyComponent'
import BoxChat from '../../component/BoxChat'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import NotFoundSearch from '../../component/NotFoundSearch'

export default function Review() {
  const [orders, setOrders] = useState()
  const [review, setReview] = useState()
  const reviewRef = useRef(null)
  const replyRef = useRef(null)
  const [replyContent, setReplyContent] = useState()
  const { messages, setMessages } = useContext(ChatContext)

  useEffect(() => {
    const fetchOrdes = async () => {
      try {
        const response = await axios.get(`/orders/basic`)
        setOrders(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrdes()
  }, [])

  const fetchReview = async (orderId, productId) => {
    if (reviewRef.current) {
      clearTimeout(reviewRef.current)
    }

    reviewRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`/reviews/${orderId}/${productId}`)
        setReview(response.data)
        // setMessages(response.data.content)
        setMessages(response.data.content || [])
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  const handleReply = () => {
    if (replyRef.current) {
      clearTimeout(replyRef.current)
    }
  
    replyRef.current = setTimeout(async () => {
      try {
        await axios.put(`/reviews/reply`, { reviewId: review?._id, content: replyContent })
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  if (!orders.length) {
    return (
      <NotFoundSearch type={'review'} />
    )
  }

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="border-end bg-light vh-100 p-0">
          <h5 className="p-3 border-bottom">My Orders</h5>
          <Accordion alwaysOpen>
            {orders?.map((order, idx) => (
              <Accordion.Item eventKey={String(idx)} key={order._id}>
                <Accordion.Header>Order #{order._id.toUpperCase().slice(-10) + "..."}</Accordion.Header>
                <Accordion.Body className="p-0">
                  <ListGroup variant="flush">
                    {order.items.map(product => (
                      <ListGroup.Item
                        action
                        key={product.productId._id}
                        className="d-flex justify-content-between align-items-center"
                        onClick={() => fetchReview(order._id, product.productId._id)}
                      >
                        {product.productId.model}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        <Col md={9} className="p-4 d-flex flex-column" style={{ height: '100vh' }}>
          <div className="flex-grow-1 overflow-auto">
            <BoxChat view={'customer'} content={messages} />
          </div>

          <div className="border-top pt-2 bg-white" style={{ position: 'sticky', bottom: 0 }}>
            <ReplyComponent
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}