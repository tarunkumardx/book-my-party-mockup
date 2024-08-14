import React, { useEffect, useState } from 'react'

import { _Object } from '@/utils/types';
import { BMPLuxe, Blogs, FAQList, Gallery, HowItWorks, Memory, Slider, Testimonials, TopPartyPlaces } from '.';
import { pageService } from '@/services/page.service';

const PageBuilder = ({ props }: _Object) => {
  const [posts, setPosts] = useState<_Object>()
  useEffect(() => {
    pageService.getAllPosts().then((result: _Object) => {
      setPosts(result)
    })
  }, [])

  return (
    <>
      {props?.pageBuilder?.pageLayout?.map((item: _Object, i: number) => {
        switch (item?.fieldGroupName) {
        case 'PageBuilderPageLayoutOffersSliderLayout':
          return (
            <Slider
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutHowItWorksLayout':
          return (
            <HowItWorks
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutTopPartyPlacesLayout':
          return (
            <TopPartyPlaces
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutBmpLuxeLayout':
          return (
            <BMPLuxe
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutMemoryLayout':
          return (
            <Memory
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutGalleryLayout':
          return (
            <Gallery
              key={i}
              props={item}
            />
          );
        case 'PageBuilderPageLayoutBlogsLayout':
          return (
            <Blogs
              key={i}
              props={item}
              posts={posts}
            />
          );
        case 'PageBuilderPageLayoutTestimonialSliderLayout':
          return (
            <Testimonials
              key={i}
              props={item}
              posts={posts}
            />
          );
        case 'PageBuilderPageLayoutFaqsListLayout':
          return (
            <FAQList
              key={i}
              items={item}
            />
          );
        default:
          return null;
        }
      })}
    </>
  )
}
export default PageBuilder

