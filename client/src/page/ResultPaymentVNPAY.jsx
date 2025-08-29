import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Copy } from 'lucide-react'
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export default function PaymentResultVNP() {
  const location = useLocation()
  const [query, setQuery] = useState({})

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let transaction = null

    const raw = params.get("transaction")
    if (raw) {
      try {
        transaction = JSON.parse(raw)
      } catch {
        transaction = raw
      }
    }

    setQuery({
      status: params.get("status"),
      message: params.get("message"),
      transaction,
    })
  }, [location.search])

  useEffect(() => {
    console.log("Transaction:", query.transaction)
  }, [query])

  const responseCode = query?.transaction?.vnp_ResponseCode
  const transactionNo = query?.transaction?.vnp_TransactionNo
  const amount = query?.transaction?.vnp_Amount
  const orderInfo = query?.transaction?.vnp_OrderInfo
  const bankCode = query?.transaction?.vnp_BankCode
  const transactionStatus = query?.transaction?.vnp_TransactionStatus || "00"

  const isSuccess = responseCode === "00" && transactionStatus === "00"
  const isPending = responseCode === "07"
  const isFailed = !isSuccess && !isPending

  const getStatusIcon = () => {
    const iconStyle = { width: '64px', height: '64px' };
    if (isSuccess) return <CheckCircle style={{ ...iconStyle, color: '#198754' }} />;
    if (isPending) return <Clock style={{ ...iconStyle, color: '#ffc107' }} />;
    return <XCircle style={{ ...iconStyle, color: '#dc3545' }} />;
  }

  const getStatusBadge = () => {
    if (isSuccess) return <Badge bg="success">Success</Badge>
    if (isPending) return <Badge bg="warning" text="dark">Pending</Badge>
    return <Badge bg="danger">Failed</Badge>
  }

  const getAlertVariant = () => {
    if (isSuccess) return 'success'
    if (isPending) return 'warning'
    return 'danger'
  }

  const TransactionRow = ({ label, value, isCode = false, showCopy = false }) => (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <span className="text-muted">{label}</span>
      <div className="d-flex align-items-center">
        {isCode ? (
          <code className={showCopy ? "me-2" : ""}>{value}</code>
        ) : (
          <span className={label === "Số tiền" ? "fw-semibold fs-5" : ""}
            style={label === "Nội dung thanh toán" ? { maxWidth: '250px', textAlign: 'right' } : {}}>
            {value}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container className="py-4" style={{ maxWidth: '600px' }}>
          <Row className="g-4">
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body className="text-center py-4 pb-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="mb-3">
                      {getStatusIcon()}
                    </div>
                    <div>
                      <h1 className="h3 fw-bold mb-3">{query?.status}</h1>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body className='p-0'>
                  <Alert variant={getAlertVariant()} className="text-center fw-medium mb-0">
                    {query.message}
                  </Alert>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Header>
                  <Card.Title as="h5" className="mb-0">Transaction Detail</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div>
                    <TransactionRow
                      label="Transaction code"
                      value={transactionNo}
                      isCode={true}
                      showCopy={true}
                    />
                    <TransactionRow
                      label="Amount"
                      value={Number(amount?.toLocaleString('vi-VN'))}
                    />
                    <TransactionRow
                      label="Transaction info"
                      value={orderInfo}
                    />
                    <TransactionRow
                      label="Bank"
                      value={bankCode?.toUpperCase()}
                    />
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span className="text-muted">Respone code</span>
                      <code>{responseCode}</code>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <Button variant="outline-primary" size="lg" className="w-100">
                    Back home
                  </Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button variant="success" size="lg" className="w-100">
                    Coninue buying
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}