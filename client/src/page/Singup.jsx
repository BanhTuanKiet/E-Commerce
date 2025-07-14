"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, InputGroup, Card, Badge } from "react-bootstrap"
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Lock } from "lucide-react"
import { ValideFormContext } from "../context/ValideForm"
import axios from "../util/AxiosConfig"

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        passwordConfirmed: "",
        location: {
            address: "",
            ward: "",
            city: "",
        },
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { formErrors, validateForm, validateField } = useContext(ValideFormContext)

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith("location.")) {
            const field = name.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: value,
                },
            }))
            return
        }
        setFormData((prev) => ({
            ...prev, [name]: value,
        }))
        validateField(name, value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errorsCount = validateForm(formData)
        if (errorsCount > 0) return
        try {
            const response = await axios.post(`/users`, formData)
            console.log(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getIcon = (name) => {
        switch (name) {
            case "name":
                return <User size={18} className="text-primary" />
            case "email":
                return <Mail size={18} className="text-primary" />
            case "phoneNumber":
                return <Phone size={18} className="text-primary" />
            case "address":
            case "ward":
            case "city":
                return <MapPin size={18} className="text-primary" />
            default:
                return null
        }
    }

    return (
        <div
            className="min-vh-100 d-flex align-items-center py-5 bg-light"
            style={{
                backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={12} className="p-4 p-md-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-primary">Đăng ký tài khoản</h2>
                                            <p className="text-muted">Vui lòng điền thông tin để tạo tài khoản mới</p>
                                        </div>

                                        <Form onSubmit={handleSubmit} noValidate>
                                            <Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Họ và tên</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text className="bg-light border-end-0">{getIcon("name")}</InputGroup.Text>
                                                                <Form.Control
                                                                    name="name"
                                                                    type="text"
                                                                    placeholder="Nhập họ và tên"
                                                                    value={formData.name}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!formErrors.name}
                                                                    className="border-start-0 ps-0"
                                                                />
                                                                <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Email</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text className="bg-light border-end-0">{getIcon("email")}</InputGroup.Text>
                                                                <Form.Control
                                                                    name="email"
                                                                    type="email"
                                                                    placeholder="Nhập email"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!formErrors.email}
                                                                    className="border-start-0 ps-0"
                                                                />
                                                                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text className="bg-light border-end-0">
                                                                    {getIcon("phoneNumber")}
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    name="phoneNumber"
                                                                    type="text"
                                                                    placeholder="Nhập số điện thoại"
                                                                    value={formData.phoneNumber}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!formErrors.phoneNumber}
                                                                    className="border-start-0 ps-0"
                                                                />
                                                                <Form.Control.Feedback type="invalid">{formErrors.phoneNumber}</Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">Giới tính</Form.Label>
                                                            <div className="d-flex gap-3">
                                                                {["male", "female"].map((g) => (
                                                                    <Form.Check
                                                                        key={g}
                                                                        type="radio"
                                                                        name="gender"
                                                                        id={`gender-${g}`}
                                                                        value={g}
                                                                        label={g === "male" ? "Nam" : "Nữ"}
                                                                        checked={formData.gender === g}
                                                                        onChange={handleChange}
                                                                        isInvalid={!!formErrors.gender}
                                                                        className="form-check-inline"
                                                                    />
                                                                ))}
                                                            </div>
                                                            {formErrors.gender && (
                                                                <Form.Control.Feedback type="invalid" className="d-block">
                                                                    {formErrors.gender}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <Lock size={18} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                name="password"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Mật khẩu"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.password}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <InputGroup.Text
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                style={{ cursor: "pointer" }}
                                                                className="bg-light"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff size={18} className="text-muted" />
                                                                ) : (
                                                                    <Eye size={18} className="text-muted" />
                                                                )}
                                                            </InputGroup.Text>
                                                            <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Xác nhận mật khẩu</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <Lock size={18} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                name="passwordConfirmed"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Xác nhận mật khẩu"
                                                                value={formData.passwordConfirmed}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.passwordConfirmed}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <InputGroup.Text
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                style={{ cursor: "pointer" }}
                                                                className="bg-light"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff size={18} className="text-muted" />
                                                                ) : (
                                                                    <Eye size={18} className="text-muted" />
                                                                )}
                                                            </InputGroup.Text>
                                                            <Form.Control.Feedback type="invalid">
                                                                {formErrors.passwordConfirmed}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                        {formData.passwordConfirmed && (
                                                            <div
                                                                className={`mt-2 d-flex align-items-center ${formData.password === formData.passwordConfirmed ? "text-success" : "text-danger"}`}
                                                            >
                                                                {formData.password === formData.passwordConfirmed ? (
                                                                    <CheckCircle size={16} className="me-2" />
                                                                ) : (
                                                                    <AlertCircle size={16} className="me-2" />
                                                                )}
                                                                <small className="fw-semibold">
                                                                    {formData.password === formData.passwordConfirmed
                                                                        ? "Mật khẩu khớp"
                                                                        : "Mật khẩu không khớp"}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Địa chỉ</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <MapPin size={18} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                name="location.address"
                                                                placeholder="Địa chỉ"
                                                                value={formData.location.address}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.address}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <Form.Control.Feedback type="invalid">{formErrors.address}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Phường/Xã</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <MapPin size={18} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                name="location.ward"
                                                                placeholder="Phường/Xã"
                                                                value={formData.location.ward}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.ward}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <Form.Control.Feedback type="invalid">{formErrors.ward}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold">Thành phố</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">
                                                                <MapPin size={18} className="text-primary" />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                name="location.city"
                                                                placeholder="Thành phố"
                                                                value={formData.location.city}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.city}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <Form.Control.Feedback type="invalid">{formErrors.city}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row className="mt-4 g-3 justify-content-center">
                                                <Col xs={12} md={6}>
                                                    <Button
                                                        type="submit"
                                                        size="md"
                                                        className="w-100 rounded-pill fw-semibold py-3 shadow-sm"
                                                        variant="outline-primary"
                                                    >
                                                        Đăng ký
                                                    </Button>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Button
                                                        type="button"
                                                        size="md"
                                                        className="w-100 rounded-pill fw-semibold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                        variant="outline-danger"
                                                    >
                                                        <img
                                                            src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                                                            alt="Google"
                                                            style={{ width: "20px", height: "20px" }}
                                                        />
                                                        Đăng ký bằng Google
                                                    </Button>
                                                </Col>
                                            </Row>


                                            <div className="text-center mt-4 pt-3 border-top">
                                                <p className="mb-0 text-muted">
                                                    Đã có tài khoản?{" "}
                                                    <a href="/" className="fw-semibold text-primary text-decoration-none">
                                                        Đăng nhập
                                                    </a>
                                                </p>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
