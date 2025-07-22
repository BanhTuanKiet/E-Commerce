import { Modal, Button, Badge, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'

const VoucherModal = ({ vouchers, show, onHide, onSelectVoucher, selectedVoucher }) => {
    const isExpired = (endDate) => {
        return new Date(endDate) < new Date()
    }

    const getDiscountText = (voucher) => {
        if (voucher.discountType === 'percentage') {
            return `${voucher.discountValue}%`
        }
        return `${voucher.discountValue?.toLocaleString('vi-VN')}₫`
    }

    const handleSelectVoucher = (voucher) => {
        onSelectVoucher(voucher)
        onHide()
    }

    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <i className="fas fa-ticket-alt me-2"></i>
                    Select Voucher
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                <div className="p-3">
                    <div className="mb-3">
                        <small className="text-muted">
                            Found {vouchers?.length} available vouchers
                        </small>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {vouchers?.map((voucher) => (
                            <Card
                                key={voucher._id}
                                className={`mb-3 ${isExpired(voucher.endDate) ? 'border-danger' : 'border-success'} ${selectedVoucher?.code === voucher.code ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                            >
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <div className="d-flex align-items-center mb-2">
                                                <Badge
                                                    bg={isExpired(voucher.endDate) ? 'danger' : 'success'}
                                                    className="me-2"
                                                >
                                                    {voucher.code}
                                                </Badge>
                                                {isExpired(voucher.endDate) && (
                                                    <Badge bg="danger">Expire</Badge>
                                                )}
                                                {selectedVoucher?.code === voucher.code && (
                                                    <Badge bg="primary" className="ms-2">
                                                        <i className="fas fa-check me-1"></i>
                                                        Selected
                                                    </Badge>
                                                )}
                                            </div>

                                            <h6 className="mb-2 text-primary d-flex align-items-center gap-2">
                                                {voucher.description}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-${voucher._id}`}>
                                                            {voucher.categories && voucher.categories.length > 0
                                                                ? 'Apply for ' + voucher.categories.join(', ')
                                                                : 'Apply to entire category'}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <i className="fas fa-question-circle text-muted" style={{ cursor: 'pointer' }}></i>
                                                </OverlayTrigger>
                                            </h6>


                                            <div className="mb-2">
                                                <small className="text-muted">
                                                    Minimize: {voucher.maxDiscount?.toLocaleString('vi-VN')}₫
                                                </small>
                                            </div>
                                        </Col>

                                        <Col md={4} className="text-end">
                                            <div className="text-center">
                                                <input
                                                    name='voucher'
                                                    type='radio'
                                                    onClick={() => handleSelectVoucher(voucher)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                {selectedVoucher && (
                    <Button variant="primary" onClick={() => handleSelectVoucher(null)}>
                        Uncheck
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default VoucherModal