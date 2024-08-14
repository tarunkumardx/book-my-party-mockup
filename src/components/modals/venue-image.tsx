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

const VenueImageSlider = ({ data }: _Object) => {
  return (
    <div className="menu-images-slider">
      <div className="modal fade" id="VenueImageSliderModal" aria-labelledby="VenueImageSliderModal" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <button type="button" className="btn modal-close-button" data-bs-dismiss="modal" aria-label="Close">
              <Image src={modalClose} width="10" height="10" alt="tourDetailImg" />

            </button>
            <div className="modal-body p-0">
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                slidesPerGroup={1}
                navigation={true}
                pagination={{ clickable: true }}
                // autoplay={{ delay: 6000 }}
                // navigation={{
                // 	nextEl: '.swiper-button-next',
                // 	prevEl: '.swiper-button-prev'
                // }}
                modules={[Navigation, Autoplay]}
              >
                {data?.map((item: _Object, i: number) => {
                  return (
                    <>
                      <SwiperSlide key={i}>
                        <Image src={item.items?.node?.mediaItemUrl || placeholder} width={380} height={540} alt="Menu Images" />
                      </SwiperSlide>
                    </>
                  );
                })}

              </Swiper>
            </div>
          </div>
        </div>
      </div >
    </div>
  )
}

export default VenueImageSlider