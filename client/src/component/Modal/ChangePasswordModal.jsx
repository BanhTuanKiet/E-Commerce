import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Key, Shield } from 'lucide-react'
import axios from '../../config/AxiosConfig'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap'
import { calculatePasswordStrength, getStrengthColor, getStrengthText } from '../../util/PasswordUtil'
import PasswordStrength from '../PasswordStrength'

export default function ChangePasswordModal({ showChangePasswordModal, setShowChangePasswordModal }) {
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const timeoutPasswordRef = useRef(null)

  useEffect(() => {
    if (passwordData?.newPassword) {
      setPasswordStrength(calculatePasswordStrength(passwordData.newPassword))
    } else {
      setPasswordStrength(0)
    }
  }, [passwordData.newPassword])

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault()
    if (timeoutPasswordRef.current) {
      clearTimeout(timeoutPasswordRef.current)
    }

    setChangingPassword(true)
    timeoutPasswordRef.current = setTimeout(async () => {
      try {
        await axios.put(`/users/password`, passwordData)
        setChangingPassword(false)
        setTimeout(() => {
          setShowChangePasswordModal(false)
          setPasswordData({})
        }, 2000)
      } catch (error) {
        console.log(error)
        setChangingPassword(false)
      }
    }, 500)
  }

  const handleClose = () => {
    setShowChangePasswordModal(false)
    setPasswordData({})
    setShowPasswords({ current: false, new: false, confirm: false })
  }

  const isFormValid = passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.passwordConfirmed &&
    passwordData.newPassword === passwordData.passwordConfirmed &&
    passwordData.newPassword.length >= 8

  return (
    <Modal show={showChangePasswordModal} onHide={handleClose} centered backdrop="static" size="md" className="change-password-modal">
      <div className="modal-content border-0 shadow-lg">
        <Modal.Body className="px-4 py-4">
          <Form onSubmit={handleSubmitChangePassword}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary mb-2">
                <Lock size={16} className="me-2" />
                Current Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData?.currentPassword || ''}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                  className="rounded-3 border-2 pe-5"
                  style={{
                    borderColor: '#e9ecef',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                </button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-secondary mb-2">
                <Key size={16} className="me-2" />
                New Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData?.newPassword || ''}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  className="rounded-3 border-2 pe-5"
                  style={{
                    borderColor: '#e9ecef',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                </button>
              </div>

              {passwordData?.newPassword && (
                  <PasswordStrength passwordStrength={passwordStrength} />
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary mb-2">
                <Key size={16} className="me-2" />
                Confirm New Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData?.passwordConfirmed || ''}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    passwordConfirmed: e.target.value
                  })}
                  className="rounded-3 border-2 pe-5"
                  style={{
                    borderColor: '#e9ecef',
                    fontSize: '15px',
                    padding: '12px 16px'
                  }}
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                </button>
              </div>

              {passwordData?.passwordConfirmed && (
                <div className={`mt-2 d-flex align-items-center ${passwordData?.newPassword === passwordData?.passwordConfirmed ? "text-success" : "text-danger"}`}>
                  {passwordData.newPassword === passwordData.passwordConfirmed ?
                    <CheckCircle size={16} className="me-2" /> :
                    <AlertCircle size={16} className="me-2" />
                  }
                  <small className="fw-semibold">
                    {passwordData.newPassword === passwordData.passwordConfirmed ? "Passwords match" : "Passwords do not match"}
                  </small>
                </div>
              )}
            </Form.Group>

            <div className="d-flex gap-3 pt-3">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                className="flex-fill rounded-3 py-2 fw-semibold border-2"
                disabled={changingPassword}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={changingPassword || !isFormValid}
                className="flex-fill rounded-3 py-2 fw-semibold border-0 text-white"
                style={{
                  background: isFormValid ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#6c757d'
                }}
              >
                {changingPassword ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Changing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="me-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </Form>

          <div className="mt-4 p-3 bg-light rounded-3">
            <h6 className="fw-semibold text-secondary mb-2 d-flex align-items-center">
              <Shield size={16} className="me-2" />
              Security Tips
            </h6>
            <ul className="list-unstyled mb-0 small text-muted">
              <li className="mb-1">• Use at least 8 characters</li>
              <li className="mb-1">• Include uppercase and lowercase letters</li>
              <li className="mb-1">• Add numbers and special characters</li>
              <li>• Avoid common words or personal information</li>
            </ul>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  )
}