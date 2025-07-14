import { useEffect, useState } from "react"
import "../style/Header.css"
import axios from "../util/AxiosConfig" // Giữ nguyên import axios
import { useNavigate } from "react-router-dom" // Giữ nguyên import useNavigate

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/categories`)
        setCategories(response?.data || [])
      } catch (error) {
        console.log("Lỗi khi lấy danh mục:", error)
      }
    }
    fetchCategories()
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3 text-dark custom-header">
      <div className="container custom-container w-75 mx-auto">
        <a className="navbar-brand fw-bold fs-4 text-dark logo-text" href="/">
          TechStore
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 category-nav">
            {categories.map((item) => (
              <li className="nav-item" key={item._id}>
                <span
                  className="nav-link px-3 text-dark category-link"
                  onClick={() => navigate(`/${item.name.toLowerCase() + "s"}`)}
                  role="button"
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3 header-actions">
            <div className="search-input-container">
              <input
                type="search"
                className="form-control search-input"
                placeholder="Tìm kiếm..."
                aria-label="Search"
              />
              <button className="search-icon-btn" aria-label="Search">
                Search
              </button>
            </div>
            <a href="/cart" className="btn btn-outline-primary position-relative cart-btn">
              Cart
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge">
                3
              </span>
            </a>
            <a href="#login" className="btn btn-primary login-btn">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}