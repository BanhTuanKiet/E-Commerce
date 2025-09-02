import { useContext, useEffect, useState } from "react"
import { Search, ShoppingCart, User, List, X } from "lucide-react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "../config/AxiosConfig"
import "../style/Header.css"
import { SearchContext } from "../context/SearchContext"

export default function Header() {
  const { user } = useContext(UserContext)
  const { searchTerm, setSearchTerm, handleSearch } = useContext(SearchContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [cartCount] = useState(0)

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

  const navigateToCategory = (categoryName) => {
    navigate(`/${categoryName}`)
    setIsMenuOpen(false)
  }

  const handleLinkClick = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const handleDropdownClick = (path) => {
    navigate(path)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-header">
        <div className="container-fluid px-3 px-lg-4" style={{ width: "80%" }}>
          <button
            onClick={() => handleLinkClick('/')}
            className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent p-0"
          >
            <div className="logo-gradient">T</div>
            <span className="logo-text d-none d-sm-block">TechStore</span>
          </button>

          <div className="d-none d-lg-flex navbar-nav mx-4">
            {categories.map((item) => (
              <button
                key={item._id}
                onClick={() => navigateToCategory(item.name)}
                className="nav-link-custom mx-1"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="d-none d-md-flex flex-grow-1 justify-content-center mx-4">
            <div className="search-container w-100">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search product..."
                className="form-control search-input w-100"
              />
              <button onClick={handleSearch} className="search-btn">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            <button className="cart-btn d-md-none">
              <Search size={20} />
            </button>

            <button
              onClick={() => handleLinkClick('/cart')}
              className="cart-btn"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {user.name ? (
              <div
                className="user-dropdown-container d-none d-md-flex align-items-center position-relative"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="user-btn d-flex align-items-center gap-2"
                  onClick={() => {
                    if (user?.role !== 'admin') {
                      handleDropdownClick('/profile#info')
                    } else {
                      handleDropdownClick('/manage#info')
                    }
                  }}
                >
                  <User size={16} />
                  <span>{user?.role}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleLinkClick('/signin')}
                className="user-btn d-none d-md-flex align-items-center gap-2"
              >
                <User size={16} />
                <span>Signin</span>
              </button>
            )}

            <button
              onClick={toggleMenu}
              className="menu-toggle d-lg-none"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
