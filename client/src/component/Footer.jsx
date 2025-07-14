import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';

export default function Footer() {
  return (
    <div className="bg-light border-top pt-4 pb-5 mt-5">
      <Container>
        <Row>
          <Col md={2}>
            <h6 className="fw-bold">Hỗ trợ Khách hàng</h6>
            <ul className="list-unstyled">
              <li>Thẻ ưu đãi</li>
              <li>Hướng dẫn mua online</li>
              <li>Ưu đãi dành cho Doanh nghiệp</li>
              <li>Chính sách trả góp</li>
              <li>Dịch vụ sửa chữa</li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-bold">Chính sách mua hàng</h6>
            <ul className="list-unstyled">
              <li>Điều kiện giao dịch chung</li>
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách thanh toán</li>
              <li>Giao hàng và Lắp đặt tại nhà</li>
              <li>Dịch vụ lắp đặt và nâng cấp PC/ Laptop tại cửa hàng & TTBH</li>
              <li>Chính sách bảo mật thanh toán</li>
              <li>Quy định Đặt cọc và Giữ hàng</li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-bold">Thông tin Phong Vũ</h6>
            <ul className="list-unstyled">
              <li>Giới thiệu Phong Vũ</li>
              <li>Hệ thống cửa hàng</li>
              <li>Trung tâm bảo hành</li>
              <li>Chính sách bảo mật</li>
              <li>Tin công nghệ</li>
              <li>Hỏi đáp</li>
              <li>Tuyển dụng</li>
            </ul>
          </Col>

          <Col md={2}>
            <h6 className="fw-bold">Cộng đồng Phong Vũ</h6>
            <ul className="list-unstyled">
              <li>Gọi mua hàng (miễn phí): <a href="tel:18006867">18006867</a></li>
              <li>Gọi chăm sóc: <a href="tel:18006865">18006865</a></li>
              <li>Facebook Phong Vũ</li>
              <li>Phong Vũ Media</li>
              <li>Phong Vũ Hội</li>
              <li>OA Phong Vũ (zalo)</li>
            </ul>
          </Col>

          <Col md={2}>
            <h6 className="fw-bold">Email liên hệ</h6>
            <ul className="list-unstyled">
              <li>Hỗ trợ Khách hàng: <a href="mailto:cskh@phongvu.vn">cskh@phongvu.vn</a></li>
              <li>Liên hệ báo giá: <a href="mailto:baogia@phongvu.vn">baogia@phongvu.vn</a></li>
              <li>Hợp tác phát triển: <a href="mailto:hoptac@phongvu.vn">hoptac@phongvu.vn</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
