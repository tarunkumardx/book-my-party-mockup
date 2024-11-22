import React from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'

const Gallery = ({ props }: _Object) => {
  return (
    <section className="moments">
      <div className="container">
        <h6 className="sub-head">{props?.title}</h6>
        <h2 style={{ fontWeight: '500' }} className="main-head">
          {props?.subTitle}
        </h2>
        <div className="row">
          <div className="d-grid">
            {props?.gallery?.nodes?.map((item: _Object, i: number) => {
              return (
                <span key={i} className="image-wrapper">
                  <Image
                    src={item?.mediaItemUrl}
                    width="234"
                    height="234"
                    alt=""
                  />
                </span>
              )
            })}
          </div>
          <Link href={props?.link?.target} className="btn btn-primary">{props?.link?.label}</Link>
        </div>
      </div>
    </section>
  )
}
export default Gallery

