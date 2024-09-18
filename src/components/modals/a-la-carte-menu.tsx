import React from 'react';
import { modalClose, placeholder, rightArrow } from '@/assets/images';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import { _Object } from '@/utils/types';

const AlaCarteMenu = ({ data }: _Object) => {
  return (
    <div className="ala-carte-menu-list">
      <div className="modal fade" id="AlaCarteMenuModel" tabIndex={-1} aria-labelledby="AlaCarteMenuModel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="btn modal-close-button" data-bs-dismiss="modal" aria-label="Close">
              <Image src={modalClose} width="10" height="10" alt="tourDetailImg" />

            </button>

            <div className="modal-body">
              <div className="swiper-navigation-buttons">
                <button className="swiper-button-prev-custom"><Image style={{ width: '20px', height: '20px' }} className="right-side-wala" src={rightArrow} alt="right-arrow-button" /></button>
                <button className="swiper-button-next-custom"><Image style={{ width: '20px', height: '20px' }} src={rightArrow} alt="right-arrow-button" /></button>
              </div>
              {data.length > 0
                ?
                <Swiper
                  spaceBetween={33}
                  slidesPerView={1}
                  slidesPerGroup={1}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom'
                  }}
                  modules={[Navigation]}
                  pagination={{ clickable: true }}
                  // autoplay={true}
                  className="lightbox-slider"
                  // autoHeight={true}
                >
                  {data.map((gallery: _Object, i: number) => {
                    return (
                      <SwiperSlide key={i}>
                        <Image
                          src={gallery?.image?.node?.mediaItemUrl || placeholder}
                          width={gallery?.image?.node?.mediaDetails?.width}
                          height={gallery?.image?.node?.mediaDetails?.height}
                          sizes="100vw"
                          style={{ width: '100%', height: '700px'}}
                          alt=""
                          className="w-100"
                        />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
                :
                <Image
                  src={placeholder}
                  width={500}
                  height={350}
                  sizes="100vw"
                  style={{ width: '100%', height: '700px' }}
                  alt=""
                  className="w-100"
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlaCarteMenu