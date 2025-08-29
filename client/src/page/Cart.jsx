
import { useState, useEffect, useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import axios from "../config/AxiosConfig"
import { formatLabel, getPrimitive } from '../util/DataClassify'
import VoucherModal from '../component/Modal/VoucherModal'
import NotFoundSearch from '../component/NotFoundSearch'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState()
  const [keys, setKeys] = useState()
  const [selectedProducts, setSelectedProducts] = useState([])
  const [vouchers, setVouchers] = useState()
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [subtotal, setSubtoal] = useState(0)
  const [total, setTotal] = useState(0)
  const timeoutCartRef = useRef(null)
  const prevCartRef = useRef()
  const timeoutOrderRef = useRef(null)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`/carts`)
        setCart(response.data)
        const objectKeys = getPrimitive(response?.data[0]?._id)
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

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setSubtoal(0)
      return
    }

    const calculateSubtotlal = () => {
      const tempSubtotal = selectedProducts?.reduce((total, item) => total + (item._id.price * item.quantity), 0) || 0
      setSubtoal(tempSubtotal)
    }

    if (selectedProducts.length > 0) {
      calculateSubtotlal()
    }
  }, [selectedProducts])

  useEffect(() => {
    if (!selectedVoucher || !selectedProducts.length) {
      setTotal(subtotal)
      return
    }

    const calculateTotal = () => {
      let amountDiscounted

      if (selectedVoucher.discountType === "percentage") {
        const discount = selectedVoucher.discountValue / 100
        const percentageAmount = subtotal * discount

        const cappedDiscount = selectedVoucher.maxDiscount
          ? Math.min(percentageAmount, selectedVoucher.maxDiscount)
          : percentageAmount

        amountDiscounted = subtotal - cappedDiscount
      } else {
        const capoedDiscount = selectedVoucher.maxDiscount
          ? Math.min(selectedVoucher.discountValue, selectedVoucher.maxDiscount)
          : selectedVoucher.discountValue

        amountDiscounted = subtotal - capoedDiscount
      }

      setTotal(amountDiscounted)
    }

    calculateTotal()
  }, [selectedVoucher, subtotal, selectedProducts])

  useEffect(() => {
    if (cart === prevCartRef.current) return

    if (timeoutCartRef.current) clearTimeout(timeoutCartRef.current)

    timeoutCartRef.current = setTimeout(() => {
      const updateCart = async () => {
        try {
          await axios.put(`/carts`, cart)
        } catch (err) {
          console.error("Failed to update cart:", err)
        }
      }

      updateCart()
      prevCartRef.current = cart
    }, 500)
  }, [cart])

  useEffect(() => {
    if (!cart || selectedProducts.length === 0) return

    const updatedSelected = selectedProducts.map((selectedItem) => {
      const matched = cart.find((c) => c._id === selectedItem._id)
      return matched ? { ...selectedItem, quantity: matched.quantity } : selectedItem
    })

    setSelectedProducts(updatedSelected)
  }, [cart])

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
      setSelectedVoucher(response.data)
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

  const handleSelectProduct = (item) => {
    if (selectedProducts.length === 0) {
      setSelectedProducts(prev => [...prev, item])
      return
    }

    setSelectedProducts(prev => {
      const isSelected = prev.some(prevItem => prevItem._id === item._id)

      if (isSelected) {
        return prev.filter(prevItem => prevItem._id !== item._id)
      } else {
        return [...prev, item]
      }
    })
  }

  const handlePlaceOrderDebounced = () => {
    if (timeoutOrderRef.current) {
      clearTimeout(timeoutOrderRef.current)
    }

    timeoutOrderRef.current = setTimeout(async () => {
      const order = {
        customerId: "",
        items: selectedProducts.map(item => ({
          productId: item._id._id,
          quantity: item.quantity,
          price: item._id.price
        })),
        subtotal,
        shippingFee: 0,
        totalAmount: total,
        paymentMethod,
        voucher: selectedVoucher
          ? {
            _id: selectedVoucher._id,
            discountAmount:
              selectedVoucher.discountType === 'percentage'
                ? Math.min(
                  subtotal * (selectedVoucher.discountValue / 100),
                  selectedVoucher.maxDiscount || Infinity
                )
                : Math.min(
                  selectedVoucher.discountValue,
                  selectedVoucher.maxDiscount || Infinity
                )
          }
          : {
            _id: null,
            discountAmount: null
          }
      }

      try {
        if (paymentMethod === 'COD') {
          await axios.post("/orders", { order: order })
        } else if (paymentMethod === 'VNPay') {
          const response = await axios.post('/orders/vnpay', order)
          window.open(response.vnpUrl)
        }

      } catch (error) {
        console.error("Lỗi đặt hàng:", error)
      }
    }, 500)
  }

  if (!cart?.length) {
    return (
      <NotFoundSearch type={'cart'} />
    )
  }

  return (
    <Container className='mt-5 w-75'>
      <Row className=''>
        <Col md={8} className='p-3 ps-0' >
          <Container fluid className="pb-2 mb-3">
            <Row className="border-bottom align-items-center fw-semibold px-2 pb-2">
              <Col md={1}></Col>
              <Col md={5} className='px-2'>
                <span>Products</span>
              </Col>
              <Col md={2} className="text-center">
                <span>Price</span>
              </Col>
              <Col md={2} className="text-center">
                <span>Quantity</span>
              </Col>
              <Col md={2} className="text-end">
                <span>Total</span>
              </Col>
            </Row>

            {cart?.map((item) => (
              <Row key={item._id._id} className="border-bottom align-items-center py-3 px-0">
                <Col md={1}>
                  <input
                    type="checkbox"
                    className="form-check-input start-0 m-2 my-auto"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onChange={() => {
                      handleSelectProduct(item)
                    }}
                  />
                </Col>
                <Col md={5} className='ps-0 d-flex'>
                  <img
                    src={item._id.images[0]}
                    alt={item._id.model}
                    style={{ width: '100px', height: '100px' }}
                    className="me-3"
                  />
                  <div>
                    <div className='text-dark'><strong>{item._id.model}</strong></div>
                    {keys?.map((key, index) => {
                      if (['category', 'discount', 'quantity', 'reviews', 'createdAt', 'sold', 'avgScore'].includes(key)) return null
                      return (
                        <div key={index} className="text-muted small">{formatLabel(key)}: {item._id[key]}</div>
                      )
                    })}
                    {item._id.stock < 20 && (
                      <div className="text-danger small fw-semibold">Sắp hết hàng</div>
                    )}
                  </div>
                </Col>

                <Col md={2} className="text-end fw-semibold">
                  {item._id.price.toLocaleString('vi-VN')}₫
                </Col>

                <Col md={2} className="text-center">
                  <div className="d-inline-flex border rounded px-2 align-items-center">
                    <Button size="sm" variant="light" className="px-2" onClick={() => handleMinus(item)}>−</Button>
                    <div className="px-3">{item.quantity}</div>
                    <Button size="sm" variant="light" className="px-2" onClick={() => handlePlus(item)}>+</Button>
                  </div>
                </Col>

                <Col md={2} className="text-end fw-semibold">
                  {(item._id.price * item.quantity).toLocaleString('vi-VN')}₫
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
            <div className="my-2">
              <h6 className='mb-3 fw-semibold'>💳 Payment</h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="COD"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="COD">
                  <i className="fas fa-money-bill-wave text-success"></i>
                  <span>COD</span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="VNPAY"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPay'}
                  onChange={() => setPaymentMethod('VNPay')}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="VNPAY">
                  <i className="fas fa-credit-card text-primary"></i>
                  <span>VNPAY</span>
                </label>
              </div>
            </div>

            <div className='d-flex justify-content-between mb-2'>
              <span className='text-muted'>Total estimated amount</span>
              <span className='fw-semibold'>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className='d-flex justify-content-between mb-2'>
              <span className='text-muted'>Shipping fee</span>
              <span className='text-success fw-semibold'>Free</span>
            </div>

            <div className='d-flex justify-content-between mb-2'>
              <span className='text-muted'>Discount</span>
              <span className='text-danger fw-semibold'>{(subtotal - total)?.toLocaleString('vi-VN')}</span>
            </div>

            <hr className='my-2' />

            <div className='d-flex justify-content-between mb-3'>
              <span className='fw-bold fs-6'>Amount payable</span>
              <span className='fw-bold fs-5 text-danger'>{total.toLocaleString('vi-VN')}₫</span>
            </div>

            <Button variant="danger" className='w-100 py-2 fw-semibold' onClick={handlePlaceOrderDebounced}>
              Mua hàng ({selectedProducts?.length || 0})
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