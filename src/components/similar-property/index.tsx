import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import { listService } from '@/services/venue.service';
import { _Object } from '@/utils/types';
import VenueTemplate from './venue-template';

const SimilarProperty = ({ location, type }: _Object) => {
  const [list, setList] = useState<_Object>([])

  useEffect(() => {
    async function fetchData() {
      const newData = await listService.getVenues(8, null, null,
        {
          locations: [location],
          types: [type],
          title: 'ASC'
        });

      setList(newData)
    }

    fetchData()
  }, [location, type])

  return (

    <div className="similar-property">
      <div className="page-container">
        <div className="row">
          <hr />
          <h3 className="main-head">
						Similar Properties
          </h3>
          <div className="swiper-container position-relative similar-properties-slider">
            <div className="swiper-arrows swiper-button-next"></div>
            <div className="swiper-arrows swiper-button-prev"></div>
            <Swiper
              spaceBetween={8}
              slidesPerView={1}
              slidesPerGroup={1}
              autoplay={true}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              }}
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination, Autoplay]}
              autoHeight={true}
              breakpoints={{
                375: {
                  slidesPerView: 1
                },
                550: {
                  slidesPerView: 2
                },
                992: {
                  slidesPerView: 3
                },
                1200: {
                  slidesPerView: 4
                }
              }}
            >

              {list?.nodes && list?.nodes?.map((item: _Object, i: number) => {
                return (
                  <SwiperSlide key={i}>
                    <VenueTemplate props={item} i={i} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default SimilarProperty;