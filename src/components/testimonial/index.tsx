import React from 'react'
import { _Object } from '@/utils/types'
import Image from 'next/image'
import { quotes, starYellow } from '@/assets/images'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';

const Testimonials = ({ props }: _Object) => {
  return (
    <section className="testimonial pb-0 pie-container" id="testimonial">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <Image
              src={quotes}
              width="150"
              height="150"
              alt=""
              className="quotes-img img-fluid"
            />
            <h6 className="sub-head">{props?.subtitle}</h6>
            <h2 style={{fontWeight:'500'}} className="main-head mb-0">
              {props?.title}
            </h2>
          </div>
          <div className="col-lg-8">
            <div className="swiper-container position-relative">
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                slidesPerGroup={1}
                autoplay={true}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
                }}
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Autoplay]}
                breakpoints={{
                  375: {
                    slidesPerView: 1
                  },
                  768: {
                    slidesPerView: 2
                  }
                }}
              >
                {props?.testimonials?.map((item: _Object, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="card">
                        <div className="card-body">
                          <Image src={item?.avatar?.node?.mediaItemUrl} alt="" width="80" height="80" />
                          <div dangerouslySetInnerHTML={{ __html: item?.quotes }} />
                        </div>
                        <div className="card-footer">
                          <ul className="list-inline mb-1">
                            <li className="list-inline-item">
                              <Image src={starYellow} width={14} height={14} alt="Reviews" />
                            </li>
                            <li className="list-inline-item">
                              <Image src={starYellow} width={14} height={14} alt="Reviews" />
                            </li>
                            <li className="list-inline-item">
                              <Image src={starYellow} width={14} height={14} alt="Reviews" />
                            </li>
                            <li className="list-inline-item">
                              <Image src={starYellow} width={14} height={14} alt="Reviews" />
                            </li>
                            <li className="list-inline-item">
                              <Image src={starYellow} width={14} height={14} alt="Reviews" />
                            </li>
                          </ul>
                          <h4>{item?.name}</h4>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Testimonials

