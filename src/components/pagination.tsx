import React from 'react'
import { _Object } from '@/utils/types'
import ReactPaginate from 'react-paginate'

const Pagination = ({ total_pages, onClick }: _Object) => {
  return (
    <>
      {total_pages > 1 && (
        <div className="pagination-wrap">
          <ReactPaginate
            breakLabel=""
            nextLabel=">"
            previousLabel="<"
            onPageChange={onClick}
            pageCount={total_pages || 0}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link previous-arrow"
            nextClassName="page-item"
            nextLinkClassName="page-link next-arrow"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>)
      }
    </>
  )
}
export default Pagination

