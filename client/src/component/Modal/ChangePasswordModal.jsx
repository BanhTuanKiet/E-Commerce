import axios from '../../config/AxiosConfig'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'

export default function ChangePasswordModal({ showChangePasswordModal, setShowChangePasswordModal }) {
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({

  })
  const timeoutPasswordRef = useRef(null)

  const handleSubmitChangePassword = async () => {
    if (timeoutPasswordRef.current) {
      clearTimeout(timeoutPasswordRef.current)
    }
console.log(passwordData)
    timeoutPasswordRef.current = setTimeout(async () => {
      try {
        const response = await axios.put(`/users/password`, passwordData)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  return (
    <Modal
      show={showChangePasswordModal}
      onHide={() => setShowChangePasswordModal(false)}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark">
          <i className="bi bi-key text-warning me-3"></i>
          Change password
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-secondary">
              <i className="bi bi-lock me-2"></i>Current password
            </Form.Label>
            <Form.Control
              type="text"
              value={passwordData?.currentPassword}
              onChange={(e) => setPasswordData({
                ...passwordData,
                currentPassword: e.target.value
              })}
              className="rounded-3"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-secondary">
              <i className="bi bi-lock-fill me-2"></i>Mật khẩu mới
            </Form.Label>
            <Form.Control
              type="text"
              value={passwordData?.newPassword}
              onChange={(e) => setPasswordData({
                ...passwordData,
                newPassword: e.target.value
              })}
              className="rounded-3"
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-secondary">
              <i className="bi bi-lock-fill me-2"></i>Xác nhận mật khẩu mới
            </Form.Label>
            <Form.Control
              type="text"
              value={passwordData?.passwordConfirmed}
              onChange={(e) => setPasswordData({
                ...passwordData,
                passwordConfirmed: e.target.value
              })}
              className="rounded-3"
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Group>

          <div className="text-end">
            <Button
              variant="outline-secondary"
              onClick={() => setShowChangePasswordModal(false)}
              className="me-2 rounded-3"
            >
              Hủy
            </Button>
            <Button
              variant="warning"
              onClick={handleSubmitChangePassword}
              disabled={changingPassword}
              className="rounded-3 px-4"
            >
              {changingPassword ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Đang đổi...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
