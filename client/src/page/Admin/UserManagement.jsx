import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Table, Modal, InputGroup } from 'react-bootstrap'
import PaginationProducts from '../../component/Pagination'
import { getBadgeGender, getBadgeRole } from '../../util/BadgeUtil'
import axios from '../../config/AxiosConfig'
import { FaEye, FaEyeSlash } from "react-icons/fa"

const UserManagement = ({ activeTab }) => {
  const mockUsers = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      gender: "male",
      phoneNumber: 123456,
      location: {
        address: "Ni Su Huynh Lien",
        ward: "Ba Hien",
        city: "Ho Chi Minh City"
      },
      role: "admin",
      status: "Active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      phoneNumber: 123456,
      location: {
        address: "Ni Su Huynh Lien",
        ward: "Ba Hien",
        city: "Ho Chi Minh City"
      },
      role: "customer",
      status: "Active",
      createdAt: "2024-01-20",
    },
  ]

  const [users, setUsers] = useState(mockUsers)
  const [filterSelections, setFilterSelections] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState()
  const [totalPages, setTotalPages] = useState(2)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const timeoutSearchUser = useRef(null)

  useEffect(() => {
    if (activeTab !== "user") return
    if (timeoutSearchUser.current) {
      clearTimeout(timeoutSearchUser.current)
    }

    timeoutSearchUser.current = setTimeout(async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/users/filters?options=${options}`)
        setUsers(response.data)
        setCurrentPage(1)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }, [activeTab, filterSelections])

  useEffect(() => {
    if (activeTab !== "user") return

    const fetchProducts = async () => {
      try {
        const options = encodeURIComponent(JSON.stringify(filterSelections))
        const response = await axios.get(`/users/filters?options=${options}&page=${currentPage}`)
        setUsers(response.data)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProducts()
  }, [activeTab, currentPage])

  const addNewAdmin = async () => {
    try {
      const response = await axios.post(`/users/signup/admin`, formData)
      setUsers([...users, response.user])
    } catch (error) {
      console.log(error)
    }
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setShowEditModal(true)
  }

  const handleFilter = (name, value) => {
    setFilterSelections({ ...filterSelections, [name]: value })
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <i className="bi bi-people text-primary fs-4"></i>
            </div>
            <div>
              <h1 className="h2 mb-1">Quản lý người dùng</h1>
              <p className="text-muted mb-0">Quản lý thông tin và quyền hạn của người dùng</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name='search'
                      placeholder="Search by name, email or phone number..."
                      value={filterSelections?.search}
                      onChange={(e) => handleFilter(e.target.name, e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    name='role'
                    value={filterSelections?.role}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  >
                    <option value="all">All role</option>
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    name='gender'
                    value={filterSelections?.gender}
                    onChange={(e) => handleFilter(e.target.name, e.target.value)}
                  >
                    <option value="all">All gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="primary" onClick={() => setShowAddModal(true)} className="w-100">
                    <i className="bi bi-plus-lg me-2"></i>
                    Add new admin
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body className="p-0">
              <Table responsive striped hover>
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Phone number</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Created at</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getBadgeGender(user.gender)}</td>
                      <td>{user.phoneNumber || "Not updated"}</td>
                      <td>{getBadgeRole(user.role)}</td>
                      <td>
                        {`${user.location.ward} - ${user.location.city}`}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>

            <PaginationProducts totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Card>
        </Col>
      </Row>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={formData?.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col style={{ position: "relative" }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={formData?.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-10%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.location?.address || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value },
                    })
                  }
                  placeholder="House number, street..."
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Ward</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.location?.ward || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, ward: e.target.value },
                    })
                  }
                  placeholder="Enter ward"
                />
              </Col>
              <Col md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.location?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                  placeholder="Enter city"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={addNewAdmin}>
            Thêm người dùng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập địa chỉ email"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary">
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default UserManagement