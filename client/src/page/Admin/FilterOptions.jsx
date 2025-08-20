import { useState, useEffect, useRef } from "react"
import { CirclePlus, Edit, Trash2, Plus, Check, Ban } from "lucide-react"
import { Badge, Button, Card, Col, Form, FormLabel, Row } from "react-bootstrap"
import axios from "../../util/AxiosConfig"
import { getTypeFilter } from "../../util/BadgeUtil"
import { toReadAble } from "../../util/DataClassify"
import AddFilterModal from "../../component/Modal/AddFilterModal"

export default function FilterOptions({ activeTab }) {
  const [categories, setCategories] = useState()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filterOptions, setFilterOptions] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteFilterOption, setIsDeleteFilterOption] = useState({})
  const [editingFilter, setEditingFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const filterOptionsRef = useRef(null)

  useEffect(() => {
    if (activeTab !== "filterOptions") return

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories")
        setCategories(response.data)
        setLoading(false)
        setSelectedCategory(response.data[0].name || undefined)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [activeTab])

  useEffect(() => {
    if (!selectedCategory) return
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`/filter_options/${selectedCategory}`)
        setFilterOptions(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchFilterOptions()
  }, [selectedCategory])

  useEffect(() => {
    if (filterOptions) setEditingFilter(filterOptions)
  }, [filterOptions])

  const handleAddValue = (key) => {
    setEditingFilter((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.key === key
          ? { ...f, values: [...f.values, f.newValue], newValue: "" } : f
      )
    }))
  }

  const handleRemoveValue = (key, index) => {
    setEditingFilter((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.key === key
          ? { ...f, values: f.values.filter((_, i) => i !== index) }
          : f
      )
    }))
  }

  const handleChangeValue = (key, e) => {
    setEditingFilter((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.key === key ? { ...f, newValue: e.target.value } : f
      )
    }))
  }

  const handleRangeChange = (key, value) => {
    setEditingFilter(prev => ({
      ...prev,
      filters: prev.filters.map(f =>
        f.key === 'price' ? { ...f, [key]: value } : f
      )
    }))
  }

  const handleSave = async () => {
    if (filterOptionsRef.current) {
      clearTimeout(filterOptionsRef.current)
    }
    console.log(editingFilter.filters)
    filterOptionsRef.current = setTimeout(async () => {
      try {
        await axios.put(`/filter_options/${selectedCategory}`, editingFilter?.filters)
        setIsEdit(false)
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-1">Quản lý Filter Options</h1>
      <p className="text-muted">
        Quản lý các bộ lọc cho từng danh mục sản phẩm
      </p>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <div style={{ maxWidth: "300px" }}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select category --</option>
            {categories?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Action buttons */}
        <div className="d-flex gap-2">
          {!isEdit ? (
            <>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => setIsEdit(true)}
              >
                <Edit size={16} className="me-1" /> Edit
              </Button>
              <Button variant="outline-danger" size="sm">
                <Trash2 size={16} className="me-1" /> Delete
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} className="me-1" /> Add Option
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setIsEdit(false)
                  setEditingFilter(filterOptions)
                  setIsDeleteFilterOption({})
                }}
              >
                <Ban size={16} className='me-1' /> Cancel
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleSave}
              >
                <Check size={16} className="me-1" /> Save
              </Button>
            </>
          )}
        </div>
      </div>

      {editingFilter && (
        <Card
          key={editingFilter?._id}
          className="border-0 shadow-sm rounded-4 mt-3"
        >
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 text-capitalize">
                {editingFilter?.category}
              </h5>
              <small className="text-muted">
                {editingFilter?.filters?.length} bộ lọc • Cập nhật:{" "}
                {new Date(editingFilter?.updatedAt).toLocaleDateString("vi-VN")}
              </small>
            </div>
          </Card.Header>
          <Card.Body className="bg-white">
            <Row className="align-items-start mb-3">
              {editingFilter?.filters?.map((filter, idx) => (
                <Col md={6} key={idx} className="mb-3">
                  <Card className="border rounded-3 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <strong>{toReadAble(filter.key)}</strong>
                        {getTypeFilter(filter.type)}

                        {isEdit && (
                          <div className="d-flex align-items-center gap-2 ms-auto">
                            {!isDeleteFilterOption[filter.key] ? (
                              <Button
                                variant={"outline-danger"}
                                onClick={() =>
                                  setIsDeleteFilterOption((prev) => ({
                                    ...prev,
                                    [filter.key]: true,
                                  }))
                                }
                                className="rounded-3"
                                size="sm"
                                name={filter.key}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setIsDeleteFilterOption(prev => ({
                                    ...prev, [filter.key]: false
                                  }))}
                                >
                                  <Ban size={16} className="me-1" />
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => 
                                    setEditingFilter(prev => ({
                                      ...prev, 
                                      filters: prev.filters.filter(p => p.key !== filter.key)
                                    }))
                                  }
                                >
                                  <Check size={16} className="me-1" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {filter.type === "range" && (
                        <>
                          {!isEdit ? (
                            <small className="text-muted d-block mb-2">
                              Min: {filter.min?.toLocaleString()} •
                              Max: {filter.max?.toLocaleString()} •
                              Step: {filter.step?.toLocaleString()}
                            </small>
                          ) : (
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              <div>
                                <FormLabel>Min</FormLabel>
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  placeholder="Min"
                                  value={filter.min || ""}
                                  onChange={(e) => handleRangeChange("min", e.target.value)}
                                />
                              </div>
                              <div>
                                <FormLabel>Max</FormLabel>
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  placeholder="Max"
                                  value={filter.max || ""}
                                  onChange={(e) => handleRangeChange(filter.key, "max", e.target.value)}
                                />
                              </div>
                              <div>
                                <FormLabel>Step</FormLabel>
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  placeholder="Step"
                                  value={filter.step || ""}
                                  onChange={(e) => handleRangeChange(filter.key, "step", e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {(filter.type === "checkbox" || filter.type === "radio") && (
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex flex-wrap gap-2">
                            {filter.values?.map((val, i) => (
                              <Badge
                                key={i}
                                bg="info"
                                className="d-flex align-items-center gap-1"
                              >
                                {val}
                                {isEdit && (
                                  <span
                                    onClick={() => handleRemoveValue(filter.key, i)}
                                    style={{ cursor: "pointer", marginLeft: "6px" }}
                                  >
                                    &times;
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>

                          {isEdit && (
                            <div className="d-flex gap-2">
                              <Form.Control
                                type="text"
                                size="sm"
                                placeholder={`Add ${toReadAble(filter.key)}...`}
                                value={filter.newValue || ""}
                                onChange={(e) => handleChangeValue(filter.key, e)}
                              />
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleAddValue(filter.key)}
                              >
                                <CirclePlus size={16} className="me-1" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

          </Card.Body>
        </Card>
      )}

      <AddFilterModal category={selectedCategory} showModal={showModal} setShowModal={setShowModal} setEditingFilter={setEditingFilter} setFilterOptions={setFilterOptions} />
    </div>
  )
}
