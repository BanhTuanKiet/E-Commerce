import React from 'react'
import '../style/OrderStatusBar.css'
import moment from 'moment'
import { Col, Row } from 'react-bootstrap'

const steps = [
    { key: 'pending', color: '#856404', bgColor: '#fff3cd' },
    { key: 'processing', color: '#004085', bgColor: '#cce5ff' },
    { key: 'shipping', color: '#0c5460', bgColor: '#d1ecf1' },
    { key: 'shipped', color: '#1b1e21', bgColor: '#d6d8d9' },
    { key: 'completed', color: '#28a745', bgColor: '#d4edda' }
]

export default function OrderStatusBar({ order }) {
    const currentStepIndex = steps.findIndex(step => step.key === order?.orderStatus)
    // console.log(order)
    const getStatusColor = (index) => {
        if (index <= currentStepIndex) {
            return steps[index].bgColor
        }
        return '#6c757d'
    }

    const getColor = (index) => {
        if (index <= currentStepIndex) {
            return steps[index].color
        }
        return 'white'
    }

    const getLineStyle = (index) => {
        return {
            position: 'absolute',
            top: '20px',
            left: '50%',
            width: '100%',
            height: '2px',
            backgroundColor: index < currentStepIndex ? '#28a745' : '#e9ecef',
            zIndex: 0
        }
    }

    return (
        <div className="order-status-bar mb-4 px-2 px-md-4">
            <div className="status-container position-relative mb-3">
                <Row className="status-steps gx-0 justify-content-between text-center position-relative pt-4">
                    {steps.map((step, index) => (
                        <Col key={step.key} xs={12} sm={6} md={2} className="mb-3 mb-md-0 position-relative">
                            {index < steps.length - 1 && (
                                <div
                                    className="d-none d-md-block"
                                    style={getLineStyle(index)}
                                />
                            )}

                            <div className="step d-flex flex-column align-items-center position-relative" style={{ zIndex: 1 }}>
                                <div
                                    className={`circle ${index <= currentStepIndex ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: getStatusColor(index),
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                        borderColor: getStatusColor(index),
                                        color: getColor(index),
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {index <= currentStepIndex ? (
                                        index === currentStepIndex ? (index + 1) : '✓'
                                    ) : (index + 1)}
                                </div>

                                <div
                                    className={`label mt-2 fw-bold ${index <= currentStepIndex ? 'active' : ''}`}
                                    style={{
                                        color: getColor(index),
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <div className="d-none d-md-block">{step.key.toUpperCase()}</div>
                                </div>

                                {index === currentStepIndex && (
                                    <div className="step-time mt-1" style={{
                                        fontSize: '0.7rem',
                                        color: '#6c757d'
                                    }}>
                                        {moment(order?.updatedAt || order?.createdAt).format('HH:mm DD/MM')}
                                    </div>
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="order-info d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top">
                <div className="order-details">
                    <small className="text-muted">
                        Order id: <span className="fw-bold text-dark">#{order?._id}</span>
                    </small>
                </div>
                <div className="last-updated">
                    <small className="text-muted">
                        Last updated: <span className="fw-bold">{moment(order?.updatedAt || order?.createdAt).format('HH:mm DD/MM/YYYY')}</span>
                    </small>
                </div>
            </div>

            {(order?.orderStatus === 'shipping' || order?.orderStatus === 'shipped') && order?.estimatedDelivery && (
                <div className="estimated-delivery mt-2 p-2 bg-light rounded">
                    <small className="text-primary">
                        <i className="fas fa-truck me-1"></i>
                        Dự kiến giao hàng: <span className="fw-bold">{moment(order.estimatedDelivery).format('DD/MM/YYYY')}</span>
                    </small>
                </div>
            )}
        </div>
    )
}