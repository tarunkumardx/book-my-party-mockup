import React from 'react'
import { _Object } from '@/utils/types'

const PageTitle = ({ props }: _Object) => {
  return (
    <section className="page-title">
      <div className="container">
        <div className="row">
          <div className="col">
            {props}
          </div>
        </div>
      </div>
    </section>
  )
}
export default PageTitle

