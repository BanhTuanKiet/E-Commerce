import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap'
import moment from 'moment'
import axios from '../../config/AxiosConfig'

export default function Profile({ activeTab }) {
  const [user, setUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isEdit, setIsEdit] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    gender: false,
    location: {
      address: false,
      ward: false,
      city: false
    }
  })

  useEffect(() => {
    if (activeTab !== "info") return
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/profile`)
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [])

  const toggleEdit = (field) => {
    setIsEdit(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const toggleNestedEdit = (parent, field) => {
    setIsEdit(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: !prev[parent][field]
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      await axios.put(`/users/profile`, { newUser: user })
      setTimeout(() => {
        setIsEdit({
          name: false,
          email: false,
          phoneNumber: false,
          gender: false,
          location: {
            address: false,
            ward: false,
            city: false
          }
        })
        setSaving(false)
      }, 1500)
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="text-center p-4">
            <h5 className="text-danger">Không thể tải thông tin người dùng</h5>
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-vh-100">
      <Container className='px-0'>
        <Card className="shadow-lg border-0 rounded-4 mb-4 overflow-hidden">
          <div className="bg-gradient bg-primary text-white p-4">
            <Row className="align-items-center">
              <Col xs="auto">
                <div
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold fs-2"
                  style={{ width: '80px', height: '80px' }}
                >
                  {user.name.charAt(0)}
                </div>
              </Col>
              <Col>
                <h2 className="fw-bold mb-1">{user.name}</h2>
                <p className="mb-0 opacity-75">
                  <i className="bi bi-envelope me-2"></i>
                  {user.email}
                </p>
              </Col>
            </Row>
          </div>
        </Card>

        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-white border-0 pt-4">
            <h3 className="fw-bold text-dark mb-0">
              <i className="bi bi-person-circle text-primary me-3"></i>
              Profile
            </h3>
          </Card.Header>

          <Card.Body className="p-4">
            <Form>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-person me-2"></i>Name
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={user.name}
                        disabled={!isEdit.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className={`rounded-3 ${isEdit.name ? 'border-primary shadow-sm' : ''}`}
                      />
                      <Button
                        variant={isEdit.name ? "outline-danger" : "outline-primary"}
                        onClick={() => toggleEdit("name")}
                        className="ms-2 rounded-3"
                      >
                        {isEdit.name ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-envelope me-2"></i>Email
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="email"
                        value={user.email}
                        disabled={!isEdit.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className={`rounded-3 ${isEdit.email ? 'border-primary shadow-sm' : ''}`}
                      />
                      <Button
                        variant={isEdit.email ? "outline-danger" : "outline-primary"}
                        onClick={() => toggleEdit("email")}
                        className="ms-2 rounded-3"
                      >
                        {isEdit.email ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-telephone me-2"></i>Phone number
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="tel"
                        value={user.phoneNumber}
                        disabled={!isEdit.phoneNumber}
                        onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                        className={`rounded-3 ${isEdit.phoneNumber ? 'border-primary shadow-sm' : ''}`}
                      />
                      <Button
                        variant={isEdit.phoneNumber ? "outline-danger" : "outline-primary"}
                        onClick={() => toggleEdit("phoneNumber")}
                        className="ms-2 rounded-3"
                      >
                        {isEdit.phoneNumber ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-gender-ambiguous me-2"></i>Gender
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={user.gender}
                        disabled={!isEdit.gender}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                        className={`rounded-3 ${isEdit.gender ? 'border-primary shadow-sm' : ''}`}
                      />
                      <Button
                        variant={isEdit.gender ? "outline-danger" : "outline-primary"}
                        onClick={() => toggleEdit("gender")}
                        className="ms-2 rounded-3"
                      >
                        {isEdit.gender ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-calendar-plus me-2"></i>Created at
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={moment(user.createdAt).format('DD/MM/YYYY HH:mm')}
                      disabled
                      className="rounded-3 bg-light"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-secondary">
                      <i className="bi bi-calendar-check me-2"></i>Last update
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={moment(user.updatedAt).format('DD/MM/YYYY HH:mm')}
                      disabled
                      className="rounded-3 bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {user.location && (
                <>
                  <hr className="my-4" />
                  <h4 className="fw-semibold text-dark mb-4">
                    <i className="bi bi-geo-alt text-primary me-3"></i>
                    Location
                  </h4>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-secondary">
                          <i className="bi bi-house me-2"></i>Address
                        </Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={user.location?.address}
                            disabled={!isEdit.location?.address}
                            onChange={(e) => setUser({
                              ...user,
                              location: { ...user.location, address: e.target.value }
                            })}
                            className={`rounded-3 ${isEdit.location?.address ? 'border-primary shadow-sm' : ''}`}
                          />
                          <Button
                            variant={isEdit.location?.address ? "outline-danger" : "outline-primary"}
                            onClick={() => toggleNestedEdit("location", "address")}
                            className="ms-2 rounded-3"
                          >
                            {isEdit.location?.address ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-secondary">
                          <i className="bi bi-signpost me-2"></i>Ward
                        </Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={user.location?.ward}
                            disabled={!isEdit.location?.ward}
                            onChange={(e) => setUser({
                              ...user,
                              location: { ...user.location, ward: e.target.value }
                            })}
                            className={`rounded-3 ${isEdit.location?.ward ? 'border-primary shadow-sm' : ''}`}
                          />
                          <Button
                            variant={isEdit.location?.ward ? "outline-danger" : "outline-primary"}
                            onClick={() => toggleNestedEdit("location", "ward")}
                            className="ms-2 rounded-3"
                          >
                            {isEdit.location?.ward ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-secondary">
                          <i className="bi bi-building me-2"></i>City
                        </Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={user.location?.city}
                            disabled={!isEdit.location?.city}
                            onChange={(e) => setUser({
                              ...user,
                              location: { ...user.location, city: e.target.value }
                            })}
                            className={`rounded-3 ${isEdit.location?.city ? 'border-primary shadow-sm' : ''}`}
                          />
                          <Button
                            variant={isEdit.location?.city ? "outline-danger" : "outline-primary"}
                            onClick={() => toggleNestedEdit("location", "city")}
                            className="ms-2 rounded-3"
                          >
                            {isEdit.location?.city ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              <hr className="my-4" />
              <div className="text-end">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-3 px-4"
                >
                  {saving ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}