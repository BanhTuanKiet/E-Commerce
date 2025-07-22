import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap"
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Lock } from "lucide-react"
import { ValideFormContext } from "../context/ValideForm"
import axios from "../util/AxiosConfig"
import OTPModal from "../component/Modal/OTPModal"
import { UserContext } from "../context/UserContext"

export default function Signup() {
    const { user, setUser, signup } = useContext(UserContext)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { formErrors, validateForm, validateField } = useContext(ValideFormContext)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [otp, setOtp] = useState(new Array(6).fill(""))

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith("location.")) {
            const field = name.split(".")[1]
            setUser((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: value,
                },
            }))
            return
        }
        setUser((prev) => ({ ...prev, [name]: value }))
        validateField(name, value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errorsCount = validateForm(user, "signup")
        if (errorsCount > 0) return
        try {
            await axios.post(`/users/signup`, { user: user })
            setShowOtpModal(true)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmitOTP = async () => {
        try {
            const reseponse = await axios.post(`/users/auth`, { user: user, otp: otp })
            signup(reseponse.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getIcon = (name) => {
        switch (name) {
            case "name": return <User size={18} className="text-primary" />
            case "email": return <Mail size={18} className="text-primary" />
            case "phoneNumber": return <Phone size={18} className="text-primary" />
            case "address":
            case "ward":
            case "city":
                return <MapPin size={18} className="text-primary" />
            default:
                return null
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center py-5 bg-light"
            style={{ backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col md={12} className="p-4 p-md-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-primary">Create an Account</h2>
                                            <p className="text-muted">Please fill in the information below</p>
                                        </div>

                                        <Form onSubmit={handleSubmit} noValidate>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">{getIcon("name")}</InputGroup.Text>
                                                            <Form.Control
                                                                name="name"
                                                                type="text"
                                                                placeholder="Enter your name"
                                                                value={user.name}
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
                                                                placeholder="Enter your email"
                                                                value={user.email}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.email}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0">{getIcon("phoneNumber")}</InputGroup.Text>
                                                            <Form.Control
                                                                name="phoneNumber"
                                                                placeholder="Enter phone number"
                                                                value={user.phoneNumber}
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
                                                        <Form.Label className="fw-semibold">Gender</Form.Label>
                                                        <div className="d-flex gap-3">
                                                            {["male", "female"].map((g) => (
                                                                <Form.Check
                                                                    key={g}
                                                                    type="radio"
                                                                    name="gender"
                                                                    id={`gender-${g}`}
                                                                    value={g}
                                                                    label={g === "male" ? "Male" : "Female"}
                                                                    checked={user.gender === g}
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

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Password</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0"><Lock size={18} className="text-primary" /></InputGroup.Text>
                                                            <Form.Control
                                                                name="password"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Password"
                                                                value={user.password}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.password}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <InputGroup.Text
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                style={{ cursor: "pointer" }}
                                                                className="bg-light"
                                                            >
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </InputGroup.Text>
                                                            <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0"><Lock size={18} className="text-primary" /></InputGroup.Text>
                                                            <Form.Control
                                                                name="passwordConfirmed"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm Password"
                                                                value={user.passwordConfirmed}
                                                                onChange={handleChange}
                                                                isInvalid={!!formErrors.passwordConfirmed}
                                                                className="border-start-0 ps-0"
                                                            />
                                                            <InputGroup.Text
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                style={{ cursor: "pointer" }}
                                                                className="bg-light"
                                                            >
                                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </InputGroup.Text>
                                                            <Form.Control.Feedback type="invalid">{formErrors.passwordConfirmed}</Form.Control.Feedback>
                                                        </InputGroup>
                                                        {user.passwordConfirmed && (
                                                            <div className={`mt-2 d-flex align-items-center ${user.password === user.passwordConfirmed ? "text-success" : "text-danger"}`}>
                                                                {user.password === user.passwordConfirmed ? <CheckCircle size={16} className="me-2" /> : <AlertCircle size={16} className="me-2" />}
                                                                <small className="fw-semibold">
                                                                    {user.password === user.passwordConfirmed ? "Passwords match" : "Passwords do not match"}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold">Street Address</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0"><MapPin size={18} className="text-primary" /></InputGroup.Text>
                                                            <Form.Control
                                                                name="location.address"
                                                                placeholder="Street address"
                                                                value={user.location.address}
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
                                                        <Form.Label className="fw-semibold">Ward</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0"><MapPin size={18} className="text-primary" /></InputGroup.Text>
                                                            <Form.Control
                                                                name="location.ward"
                                                                placeholder="Ward"
                                                                value={user.location.ward}
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
                                                        <Form.Label className="fw-semibold">City</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="bg-light border-end-0"><MapPin size={18} className="text-primary" /></InputGroup.Text>
                                                            <Form.Control
                                                                name="location.city"
                                                                placeholder="City"
                                                                value={user.location.city}
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
                                                    <Button type="submit" size="md" className="w-100 rounded-pill fw-semibold py-3 shadow-sm" variant="outline-primary">
                                                        Sign Up
                                                    </Button>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Button type="button" size="md" className="w-100 rounded-pill fw-semibold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2" variant="outline-danger">
                                                        <img
                                                            src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                                                            alt="Google"
                                                            style={{ width: "20px", height: "20px" }}
                                                        />
                                                        Sign up with Google
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <div className="text-center mt-4 pt-3 border-top">
                                                <p className="mb-0 text-muted">
                                                    Already have an account?{" "}
                                                    <a href="/" className="fw-semibold text-primary text-decoration-none">
                                                        Sign In
                                                    </a>
                                                </p>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <OTPModal
                            show={showOtpModal}
                            setShowOtpModal={setShowOtpModal}
                            otp={otp}
                            setOtp={setOtp}
                            handleSubmitOTP={handleSubmitOTP}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}