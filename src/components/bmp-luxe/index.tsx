import React from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';

const BMPLuxe = ({ props }: _Object) => {
  return (
    <section className="luxe-selections">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-xl-3">
            <h2 className="main-head">
              {props?.title}
            </h2>
            <div className="main-description" dangerouslySetInnerHTML={{ __html: props?.description }} />
            <Link href={props?.link?.target} className="btn btn-primary d-none d-lg-inline-block">{props?.link?.label}</Link>
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="swiper-container">
              <Swiper
                autoplay={true}
                loop={true}
                navigation={true}
                modules={[Autoplay, Navigation]}
                breakpoints={{
                  575: {
                    slidesPerView: 1
                  },
                  767: {
                    slidesPerView: 2
                  },
                  992: {
                    slidesPerView: 3
                  }
                }}
                className="selection-slider"
              >
                {props?.items?.map((item: _Object, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="col">
                        <div className="card">
                          <Link href={`/venues/${item?.link?.target}`} className="d-inline-block">
                            <Image
                              src={item?.image?.node?.mediaItemUrl}
                              width={250}
                              height={250}
                              alt=""
                            />
                          </Link>
                          <div className="card-body">
                            <h5>
                              <Link href={`/venues/${item?.link?.target}`}>
                                {item?.title}
                              </Link>
                            </h5>
                            <hr />
                            <p>
                              <Link href={`/venues/${item?.link?.target}`}>
                                {item?.location}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}

                <Link href={props?.link?.target} className="btn btn-primary d-lg-none mx-auto mt-4">{props?.link?.label}</Link>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default BMPLuxe

