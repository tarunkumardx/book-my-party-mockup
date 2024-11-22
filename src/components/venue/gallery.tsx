/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup'

import Link from 'next/link';
import { Button } from '@/stories/form-inputs';
import { useDispatch, useSelector } from 'react-redux';
import { _Object } from '@/utils/types';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { venueData } from '@/redux/slices/venue.slice';
import { ImageUploader } from '..';
import Image from 'next/image';
import { modalClose } from '@/assets/images';
import { uploadImages } from '@/utils/helpers';

const VenueGallery = ({ props }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()
  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  const [featureImage, setFeatureImage] = useState(venueState?.featureImage || '')

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
  }, [])

  const formik: _Object = useFormik({
    initialValues: {
      videoUrl: venueState?.videoUrl || '',
      featureImage: venueState?.featureImage || '',
      galleryImages: venueState?.galleryImages || {
        images: [],
        images_url: [],
        imagesDataBaseId: []
      }
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      videoUrl: yup.string().optional().url().label('Video Url')
    }),

    onSubmit: async (values: _Object) => {
      values.featureImage = featureImage
      dispatch(venueData({ ...venueState, videoUrl: values.videoUrl, featureImage: values.featureImage, galleryImages: values.galleryImages }))

      props.setSteps((prev: _Object) => ({
        ...prev,
        step3: true
      }))
      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=3'
      })
    }
  })

  const handleMultipleIMages = async (e: _Object) => {
    const file = e?.target?.files && e?.target?.files[0];

    if (file) {
      formik.setFieldValue('galleryImages.images',
        [...formik.values.galleryImages.images, file]
      );
      formik.setFieldValue('galleryImages.images_url',
        [...formik.values.galleryImages.images_url, await uploadImages(file)]
      );
    }
  };

  const removeImage = (imageIndex: number) => {
    formik.setFieldValue('galleryImages.images', formik.values?.galleryImages?.images?.filter((image: _Object, index: number) => index !== imageIndex))
    formik.setFieldValue('galleryImages.images_url', formik?.values?.galleryImages?.images_url?.filter((image: _Object, index: number) => index !== imageIndex))

    if (formik?.values?.galleryImages?.imagesDataBaseId?.length > 0) {
      formik.setFieldValue('galleryImages.imagesDataBaseId', formik?.values?.galleryImages?.imagesDataBaseId?.filter((image: _Object, index: number) => index !== imageIndex))
    }
  }

  const backButton = () => {
    dispatch(venueData({ ...venueState, videoUrl: formik.values.videoUrl, featureImage: featureImage, galleryImages: formik.values.galleryImages }))
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card">
        <div className="card-body">

          <div className="d-grid">

            <h4 className="mb-3">Gallery</h4>
            <label className="form-label">Video</label>
            <div className="form-group mb-30">
              <input
                type="url"
                name="videoUrl"
                className="form-control"
                placeholder="Enter video URL"
                value={formik.values.videoUrl}
                onChange={formik.handleChange}
              />
              {formik.touched.videoUrl && formik.errors.videoUrl && <span className="text-danger">{formik.touched.videoUrl && formik.errors.videoUrl}</span>}
            </div>

            <label className="form-label">Featured Image <span className="text-danger">*</span></label>
            <ImageUploader
              state={featureImage}
              setState={setFeatureImage}
              multiple={false}
            />
          </div>

          <hr className="mb-30" />

          <div className="d-grid">
            <label className="form-label">Gallery</label>

            <div className="row">
              <div className="col">
                <div className="d-flex gap-3">
                  {formik.values.galleryImages.images_url?.length > 0 &&
										formik.values.galleryImages.images_url?.map((item: string, index: number) => {
										  return (
										    <div key={index} className="Sketch-close-wrap">
										      <Image src={item} width="100" height="100" alt="tourDetailImg" className="item-img" />
										      <button onClick={() => removeImage(index)} type="button" className="border-0">
										        <Image src={modalClose} width="8" height="8" alt="tourDetailImg" />
										      </button>
										    </div>
										  )
										})
                  }
                  <div className="form-group mb-30 uploadfile">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e: _Object) => handleMultipleIMages(e)}
                    />

                    <div className="inner">
                      <span className="add">+</span>
                      <span className="text">Upload</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <hr className="mb-30" />

        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?step=1` : '/dashboard/venues/create?step=1'} className="btn btn-primary">Back</Link>
        <Button type="submit" label="Continue" className="btn btn-primary" />
      </div>
    </form>
  )
}

export default VenueGallery