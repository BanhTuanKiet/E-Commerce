import { Modal, Button, Form } from "react-bootstrap"
import { useRef } from "react"
import axios from "../../util/AxiosConfig"

export default function OTPModal({ show, setShowOtpModal, otp, setOtp, handleSubmitOTP }) {
    const inputsRef = useRef([])

    const handleChange = (e, index) => {
        const value = e.target.value
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputsRef.current[index + 1].focus()
        }
        if (!value && e.nativeEvent.inputType === "deleteContentBackward" && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    const handleClose = () => {
        setOtp(new Array(6).fill(""))
        setShowOtpModal(false)
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>Please enter the 6-digit code sent to your email.</p>
                <div className="d-flex justify-content-center gap-2">
                    {otp.map((digit, idx) => (
                        <Form.Control
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            autoFocus={idx === 0}
                            onChange={(e) => handleChange(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            className="text-center fs-4"
                            style={{ width: "3rem", height: "3.5rem" }}
                        />
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmitOTP}>Verify</Button>
            </Modal.Footer>
        </Modal>
    )
}
