import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap'
import axios from "../util/AxiosConfig"
import { formatLabel, getPrimitive } from '../util/DataClassify';
import VoucherModal from '../component/VoucherModal';

export default function Cart() {
    const [cart, setCart] = useState()
    const [keys, setKeys] = useState()
    const [vouchers, setVouchers] = useState()
    const [selectedVoucher, setSelectedVoucher] = useState(null)
    const [showVoucherModal, setShowVoucherModal] = useState(false)
    const [voucherCode, setVoucherCode] = useState('')

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/carts/${"64e37d4f9e8c6b2a8f1b0000"}`)
                setCart(response.data)
                const objectKeys = getPrimitive(response.data[0])
                setKeys(objectKeys.filter(key => !['_id', 'stock', 'price', 'model'].includes(key)))
            } catch (error) {
                console.log(error)
            }
        }

        fetchCart()
    }, [])

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('/vouchers')
                setVouchers(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchVouchers()
    }, [])

    const calculateSubtotal = () => {
        return cart?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
    }

    const handleSelectVoucher = (voucher) => {
        setSelectedVoucher(voucher)
        if (voucher) {
            setVoucherCode(voucher.code)
        } else {
            setVoucherCode('')
        }
    }

    const handleApplyVoucherCode = async () => {
        if (!voucherCode.trim()) return

        try {
            const response = await axios.get(`/vouchers/${voucherCode}`)
            const voucher = response.data

            setSelectedVoucher(voucher)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null)
        setVoucherCode('')
    }

    const handlePlus = (item) => {
        setCart(prev => 
            prev.map(cartItem => 
                cartItem._id === item._id 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
        )
    }

    const handleMinus = (item) => {
        setCart(prev => 
            prev.map(cartItem => 
                cartItem._id === item._id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
            )
        )
    }

    return (
        <Container className='mt-5 w-75'>
            <Row className=''>
                <Col md={8} className='p-3 ps-0' >
                    <Container fluid className="pb-2 mb-3">
                        <Row className="border-bottom align-items-center fw-semibold px-2 pb-2">
                            <Col md={6} className='px-0'>
                                <span>Sản phẩm</span>
                            </Col>
                            <Col md={2} className="text-center">
                                <span>Đơn giá</span>
                            </Col>
                            <Col md={2} className="text-center">
                                <span>Số lượng</span>
                            </Col>
                            <Col md={2} className="text-end">
                                <span>Thành tiền</span>
                            </Col>
                        </Row>

                        {cart?.map((item) => (
                            <Row key={item._id} className="border-bottom align-items-center py-3 px-0">
                                <Col md={6} className='ps-0 d-flex'>
                                    <img
                                        src={item.images[0]}
                                        alt={item.model}
                                        style={{ width: '100px', height: '100px' }}
                                        className="me-3"
                                    />
                                    <div>
                                        <div className='text-dark'><strong>{item.model}</strong></div>
                                        {keys?.map((key, index) => {
                                            if (['category', 'discount', 'quantity'].includes(key)) return null
                                            return (
                                                <div key={index} className="text-muted small">{formatLabel(key)}: {item[key]}</div>
                                            )
                                        })}
                                        {item.stock < 20 && (
                                            <div className="text-danger small fw-semibold">Sắp hết hàng</div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={2} className="text-end fw-semibold">
                                    {item.price.toLocaleString('vi-VN')}₫
                                </Col>

                                <Col md={2} className="text-center">
                                    <div className="d-inline-flex border rounded px-2 align-items-center">
                                        <Button size="sm" variant="light" className="px-2" onClick={() => handleMinus(item)}>−</Button>
                                        <div className="px-3">{item.quantity}</div>
                                        <Button size="sm" variant="light" className="px-2" onClick={() => handlePlus(item)}>+</Button>
                                    </div>
                                </Col>

                                <Col md={2} className="text-end fw-semibold">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </Col>
                            </Row>
                        ))}
                    </Container>
                </Col>

                <Col md={4} className='px-0' >
                    <div className='shadow-sm rounded p-3 bg-white mb-3'>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h6 className='mb-0 fw-semibold'>🎟️ Voucher</h6>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setShowVoucherModal(true)}
                            >
                                Select voucher
                            </Button>
                        </div>

                        <div className='border rounded p-2 bg-light mb-2'>
                            <div className='d-flex align-items-center'>
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className='form-control form-control-sm border-0 bg-transparent'
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className='ms-2'
                                    onClick={handleApplyVoucherCode}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>

                        {selectedVoucher && (
                            <div className='p-2 bg-success bg-opacity-10 rounded border border-success'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <small className='text-success fw-semibold'>
                                            ✅ {selectedVoucher.code}
                                        </small>
                                        <div className='small text-muted'>
                                            {selectedVoucher.description}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={handleRemoveVoucher}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='shadow-sm rounded p-3 bg-white mb-3'>
                        <h6 className='mb-3 fw-semibold'>💳 Thanh toán</h6>

                        <div className='d-flex justify-content-between mb-2'>
                            <span className='text-muted'>Tổng tiền tạm tính</span>
                            {/* <span className='fw-semibold'>{subtotal.toLocaleString('vi-VN')}₫</span> */}
                        </div>

                        <div className='d-flex justify-content-between mb-2'>
                            <span className='text-muted'>Phí vận chuyển</span>
                            <span className='text-success fw-semibold'>Miễn phí</span>
                        </div>

                        {/* {discount > 0 && (
                            <div className='d-flex justify-content-between mb-2'>
                                <span className='text-muted'>Giảm giá</span>
                                <span className='text-danger fw-semibold'>-{discount.toLocaleString('vi-VN')}₫</span>
                            </div>
                        )} */}

                        <hr className='my-2' />

                        <div className='d-flex justify-content-between mb-3'>
                            <span className='fw-bold fs-6'>Tổng cộng</span>
                            {/* <span className='fw-bold fs-5 text-danger'>{total.toLocaleString('vi-VN')}₫</span> */}
                        </div>

                        <Button variant="danger" className='w-100 py-2 fw-semibold'>
                            Mua hàng ({cart?.length || 0})
                        </Button>
                    </div>
                </Col>
            </Row>

            <VoucherModal
                vouchers={vouchers}
                show={showVoucherModal}
                onHide={() => setShowVoucherModal(false)}
                onSelectVoucher={handleSelectVoucher}
                selectedVoucher={selectedVoucher}
            />
        </Container>
    )
}