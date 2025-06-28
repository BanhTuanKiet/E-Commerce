import React, { useEffect, useState } from 'react';
import '../style/Header.css';
import axios from '../util/AxiosConfig';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/categories`);
        setCategories(response?.data || []); // Đảm bảo lấy đúng mảng
      } catch (error) {
        console.log("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand fw-bold fs-4 text-dark" href="/">
          TechStore
        </a>

        {/* Toggle menu mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {/* Danh mục động */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {categories.map((item) => (
              <li className="nav-item" key={item._id}>
                <a className="nav-link px-3 text-dark" href={`/${item.name.toLowerCase() + "s"}`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Tìm kiếm + đăng nhập + giỏ hàng */}
          <div className="d-flex align-items-center gap-3">
            <input
              type="search"
              className="form-control"
              placeholder="Tìm kiếm..."
              style={{ width: '200px' }}
            />

            <a href="#cart" className="btn btn-outline-secondary position-relative">
              🛒
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </a>

            <a href="#login" className="btn btn-dark">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
