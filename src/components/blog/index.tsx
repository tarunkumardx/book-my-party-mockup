import React from 'react'
import { _Object } from '@/utils/types'
import PostTemplate from '@/templates/post'
import Link from 'next/link'

const Blogs = ({ props, posts }: _Object) => {
  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h6 className="sub-head">
              {props.title}
            </h6>
            <div className="main-head" dangerouslySetInnerHTML={{ __html: `<h2>${props.subtitle}</h2>` }} />

            <div className="main-description" dangerouslySetInnerHTML={{ __html: props?.description }} />
            <Link href={props?.link?.target} className="btn btn-primary d-none d-lg-inline-block">{props?.link?.label}</Link>
          </div>

          <div className="col mx-lg-4 mx-md-0">
            <div className="overflow">
              {posts?.map((item: _Object, i: number) => {
                return (
                  <PostTemplate key={i} args={item} type="list" short="true" />
                )
              })}
            </div>
            <Link href={props?.link?.target} className="btn btn-primary d-lg-none mx-auto mt-4">{props?.link?.label}</Link>

          </div>
        </div>
      </div>
    </section>
  )
}
export default Blogs

