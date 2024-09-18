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
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${month}-${day}-${year}`;

  return (
    <section className="luxe-selections">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-xl-3">
            <h2 style={{ fontWeight: '500' }} className="main-head">
              {props?.title}
            </h2>
            <div className="main-description" dangerouslySetInnerHTML={{ __html: props?.description }} />
            <Link href={props?.link?.target} className="btn btn-primary d-none d-lg-inline-block" target="_blank">{props?.link?.label}</Link>
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
                          <Link href={`/venues/${item?.link?.target}?locations=${'delhi-ncr'}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} className="d-inline-block" target="_blank">
                            <Image
                              src={item?.image?.node?.mediaItemUrl}
                              width={250}
                              height={250}
                              alt=""
                            />
                          </Link>
                          <div className="card-body">
                            <h5>
                              <Link href={`/venues/${item?.link?.target}?locations=${'delhi-ncr'}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank">
                                {item?.title}
                              </Link>
                            </h5>
                            <hr />
                            <p>
                              <Link href={`/venues/${item?.link?.target}?locations=${'delhi-ncr'}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank">
                                {item?.location}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}

                <Link href={props?.link?.target} className="btn btn-primary d-lg-none mx-auto mt-4" target="_blank">{props?.link?.label}</Link>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default BMPLuxe

