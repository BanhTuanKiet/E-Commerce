import axios from '../../config/AxiosConfig'
import React, { useState } from 'react'
import { Button, Form, Modal, Badge } from 'react-bootstrap'
import { CirclePlus } from 'lucide-react'
import { warning } from '../../util/NotifyUtil'

export default function AddFilterModal({ category, showModal, setShowModal, setEditingFilter, setFilterOptions }) {
  const [newOption, setNewOption] = useState({
    key: "",
    label: "",
    type: "checkbox",
    values: []
  })
  const [newValue, setNewValue] = useState("")

  const handleSaveNewOption = async () => {
    if (!newOption.key) {
      warning("Key can not be empty")
    }

    try {
      const response = await axios.put(`/filter_options/add/${category}`, newOption)
      setFilterOptions(response.data)
      setNewOption({
        key: "",
        label: "",
        type: "checkbox",
        values: []
      })
      setNewValue("")
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddValue = () => {
    if (!newValue.trim()) return
    setNewOption((prev) => ({
      ...prev,
      values: [...prev.values, newValue.trim()]
    }))
    setNewValue("")
  }

  const handleRemoveValue = (index) => {
    setNewOption((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm Option mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Key</Form.Label>
            <Form.Control
              value={newOption.key}
              onChange={(e) =>
                setNewOption({ ...newOption, key: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Label</Form.Label>
            <Form.Control
              value={newOption.label}
              onChange={(e) =>
                setNewOption({ ...newOption, label: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={newOption.type}
              onChange={(e) =>
                setNewOption({ ...newOption, type: e.target.value })
              }
            >
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="range">Range</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Values</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {newOption.values.map((val, i) => (
                <Badge key={i} bg="info" className="d-flex align-items-center gap-1">
                  {val}
                  <span
                    onClick={() => handleRemoveValue(i)}
                    style={{ cursor: "pointer" }}
                  >
                    &times;
                  </span>
                </Badge>
              ))}
            </div>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                size="sm"
                placeholder={`Add value...`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <Button size="sm" variant="primary" onClick={handleAddValue}>
                <CirclePlus size={16} />
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSaveNewOption}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
