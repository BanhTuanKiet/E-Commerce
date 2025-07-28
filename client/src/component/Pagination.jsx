import React from 'react'
import { Pagination } from 'react-bootstrap'

export default function PaginationProducts({ totalPages, currentPage, setCurrentPage }) {
  const renderPaginationItems = () => {
    const pages = []

    const pageLimit = 5 // số lượng nút trang hiển thị (tùy chỉnh)
    let start = Math.max(1, currentPage - Math.floor(pageLimit / 2))
    let end = Math.min(totalPages, start + pageLimit - 1)

    if (end - start < pageLimit - 1) {
      start = Math.max(1, end - pageLimit + 1)
    }

    if (start > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>,
        <Pagination.Ellipsis key="start-ellipsis" disabled />
      )
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      )
    }

    if (end < totalPages) {
      pages.push(
        <Pagination.Ellipsis key="end-ellipsis" disabled />,
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      )
    }

    return pages
  }

  return (
    <>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  )
}
