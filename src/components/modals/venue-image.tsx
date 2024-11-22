import React from 'react';
import { _Object } from '@/utils/types';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import Image from 'next/image';
import { modalClose, placeholder } from '@/assets/images';
import { rightArrow } from '@/assets/images';

const VenueImageSlider = ({ data }: _Object) => {
  return (
    <div className="menu-images-slider">
      <div
        className="modal fade"
        id="VenueImageSliderModal"
        aria-labelledby="VenueImageSliderModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header with Close Button */}
            <button
              type="button"
              className="btn modal-close-button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <Image src={modalClose} width="10" height="10" alt="tourDetailImg" />
            </button>

            {/* Modal Body with Swiper Slider */}
            <div className="modal-body p-0">
              {/* Swiper Navigation Buttons Inside Modal */}
              <div className="swiper-navigation-buttons">
                <button className="swiper-button-prev-custom"><Image style={{ width: '20px', height: '20px' }} className="right-side-wala" src={rightArrow} alt="right-arrow-button" /></button>
                <button className="swiper-button-next-custom"><Image style={{ width: '20px', height: '20px' }} src={rightArrow} alt="right-arrow-button" /></button>
              </div>

              {/* Swiper Slider */}
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                slidesPerGroup={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom'
                }}
                pagination={{ clickable: true }}
                modules={[Navigation, Autoplay]}
              >
                {data?.map((item: _Object, i: number) => (
                  <SwiperSlide key={i}>
                    <Image
                      src={item.items?.node?.mediaItemUrl || placeholder}
                      width={380}
                      height={540}
                      alt="Menu Images"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueImageSlider