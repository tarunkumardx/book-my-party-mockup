import React from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image'

const HowItWorks = ({ props }: _Object) => {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="main-head">How It Works</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 gy-4">
          {props?.workBoxes?.map((item: _Object, i: number) => {
            return (
              <div key={i} className="col">
                <div style={{height:'420px'}} className="card">
                  <Image src={item?.icon?.node?.mediaItemUrl} height="95" width="95" alt="" />
                  <div className="card-body">
                    <h3>
                      {item.title}
                    </h3>
                    <div style={{paddingTop:'10px'}} dangerouslySetInnerHTML={{ __html: item?.description }} />
                  </div>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}
export default HowItWorks

