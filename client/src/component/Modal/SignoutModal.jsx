import axios from '../../config/AxiosConfig'
import { useContext, useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext'

export default function SignoutModal({ showSignOutModal, setShowSignOutModal }) {
  const [loggingOut, setLogingOut] = useState()
  const { signout } = useContext(UserContext)

  const handleConfirmLogout = async () => {
    setLogingOut(true)
    try {
      await axios.post(`/users/signout`)
      setTimeout(async () => {
        await signout()
        setLogingOut(false)
      }, 700)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      show={showSignOutModal}
      onHide={() => setShowSignOutModal(false)}
      centered
      size="sm"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark">
          <i className="bi bi-question-circle text-danger me-3"></i>
          Confirm signout
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <p className="mb-4 text-secondary">
          Are you signout from websit
        </p>

        <div className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => setShowSignOutModal(false)}
            className="me-2 rounded-3"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmLogout}
            disabled={loggingOut}
            className="rounded-3 px-4"
          >
            {loggingOut ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Signouting...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-right me-2"></i>
                Signout
              </>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
