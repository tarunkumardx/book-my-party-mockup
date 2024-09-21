import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';

import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';

import { _Object } from '@/utils/types';
import Link from 'next/link';
import { CorporateGiftColored } from '@/assets/images';

const Slider = ({ props }: _Object) => {
  const [index, setIndex] = useState(0)

  const handleClick = (index: number) => {
    setIndex(index)
  }
  return (
    <section className="offer" id="partners-offers">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="offers-head nav d-md-none pb-0">
              <h2 className="main-head nav-item d-flex d-md-none">
                {props?.title}


                <Link href={'/Coming-soon'} className="nav-link active" style={{ marginLeft: '20px', borderRadius: '10px', backgroundColor: '#fd8f1e' }} target="_blank"><Image src={CorporateGiftColored} alt="Corporate Gifting" height={25} width={25}></Image>&nbsp; Corporate Gifting</Link>

              </h2>
            </div>
            <div className="offers-head d-flex justify-content-between">
              <ul className="nav nav-pills align-items-center" id="pills-tab" role="tablist">
                <li className="nav-item custom-head d-none d-md-inline-block">
                  {props?.title}
                </li>
                {props?.offers?.map((item: _Object, i: number) => {
                  return (
                    <li key={i} className="nav-item" role="presentation">
                      <button className={`nav-link ${i === index ? 'active' : ''}`} id="pills-allOffers-tab" data-bs-toggle="pill" data-bs-target="#pills-allOffers" type="button" role="tab" aria-controls="pills-allOffers" aria-selected="true" onClick={() => handleClick(i)}>{item?.tabTitle}</button>
                    </li>
                  )
                })}

              </ul>
              <Link href={'/Coming-soon'} className="btn btn-primary d-none d-md-flex corporateGifting" style={{ marginRight: '38px', fontWeight: 'bolder' }} target="_blank"><Image src={CorporateGiftColored} alt="Corporate Gifting" height={25} width={25}></Image>&nbsp; Corporate Gifting</Link>
            </div>
            <div className="tab-content" id="pills-tabContent">
              <div className="tab-pane fade show active" id="pills-allOffers" role="tabpanel" aria-labelledby="pills-allOffers-tab" tabIndex={0}>
                <Swiper
                  spaceBetween={50}
                  slidesPerView={1}
                  autoplay={true}
                  loop={true}
                  pagination={{ clickable: true }}
                  modules={[Autoplay, Pagination]}
                >
                  {props?.offers && props?.offers[index]?.offerSlider?.map((item: _Object, index: number) => {
                    return (
                      <SwiperSlide key={index}>
                        <Link href={item?.url || ''}>
                          <Image src={item?.image?.node?.mediaItemUrl} width="1200" height="385" alt="" className="img-fluid" />
                        </Link>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Slider