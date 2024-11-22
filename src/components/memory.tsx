import React from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image'

const Memory = ({ props }: _Object) => {
  return (
    <section className="loved-onces">
      <div className="container-fluid">
        <div className="row">
          <div className="col p-0 text-center">
            <Image src={props?.image?.node?.mediaItemUrl} width="1920" height="350" alt="" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  )
}
export default Memory

