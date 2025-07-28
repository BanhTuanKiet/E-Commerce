import { Lock, User } from "lucide-react"
import React, { useContext, useState } from "react"
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap"
import { ValideFormContext } from "../context/ValideForm"
import { UserContext } from "../context/UserContext"
import axios from "../util/AxiosConfig"

export default function Signin() {
    const { formErrors, validateForm, validateField } = useContext(ValideFormContext)
    const { user, setUser, signin } = useContext(UserContext)

    const handleChange = (e) => {
        setUser((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
        validateField(e.target.nam, e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errsCount = validateForm(user, "signin")
        if (errsCount > 0) return
        try {
            const reseponse = await axios.post(`/users/signin`, { user: user })
            signin(reseponse.data.role, reseponse.data.name)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
            <Container>
                <Row className="justify-content-center mx-auto">
                    <Col xs={12} md={8} lg={6}>
                        <div className="bg-white p-5 rounded-4 shadow-sm">
                            <h2 className="text-center mb-4 fw-bold">Signin</h2>
                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <User size={18} className="text-primary" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={user.email}
                                            onChange={handleChange}
                                            isInvalid={!!formErrors.email}
                                            className="border-start-0 ps-0"
                                        />
                                        <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Lock size={18} className="text-primary" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            onChange={handleChange}
                                            isInvalid={!!formErrors.email}
                                            className="border-start-0 ps-0"
                                            value={user.password}
                                        />
                                        <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Row className="g-3">
                                    <Col xs={12} md={6}>
                                        <Button
                                            type="submit"
                                            size="md"
                                            className="w-100 rounded-pill fw-semibold py-3 shadow-sm"
                                            variant="outline-primary"
                                        >
                                            Đăng nhập
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
                                            Đăng nhập bằng Google
                                        </Button>
                                    </Col>
                                </Row>

                                <div className="mt-4 text-center">
                                    <span>Bạn chưa có tài khoản? </span>
                                    <a href="/signup" className="text-decoration-none fw-semibold">
                                        Đăng ký ngay
                                    </a>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
