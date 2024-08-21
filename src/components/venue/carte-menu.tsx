/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup'

import { Button, InputField } from '@/stories/form-inputs';
import Link from 'next/link';
import { _Object } from '@/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { venueData } from '@/redux/slices/venue.slice';
import Image from 'next/image';
import { modalClose } from '@/assets/images';
import { uploadImages } from '@/utils/helpers';

const CarteMenu = ({ props }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()
  const { venueState } = useSelector((state: _Object) => state.venueDetails);

  const defaultMenuItem: _Object = {
    title: '',
    images: [],
    images_url: [],
    imagesDataBaseId: []
  }

  const [initialData, setInitialData] = useState<_Object>({
    alaCarteMenu: venueState?.alaCarteMenu || [
      {
        title: '',
        images: [],
        images_url: [],
        imagesDataBaseId: []
      }
    ]
  });

  function getWordForValue(value: number) {
    const wordMap: _Object = {
      1: 'First',
      2: 'Second',
      3: 'Third',
      4: 'Fourth',
      5: 'Fifth',
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine',
      10: 'Ten',
      11: 'Eleven',
      12: 'Twelve'
    };

    return wordMap[value] || 'Unknown';
  }

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
  }, [])

  const formik: _Object = useFormik({
    initialValues: initialData,

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      alaCarteMenu: yup.array().of(
        yup.object().shape({
          title: yup.string().required().label('Title')
        })
      )
    }),

    onSubmit: async (values: _Object) => {
      dispatch(venueData({ ...venueState, alaCarteMenu: values.alaCarteMenu }))

      props.setSteps((prev: _Object) => ({
        ...prev,
        step4: true
      }))

      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query:  (venueState?.type === 'banquet' || venueState.type === 'farm-house') ? 'step=4' : 'step=5'
      })
    }
  })

  const menuItemCount = async (action: string, i = -1) => {
    if (action === 'Add') {
      setInitialData(prevData => ({
        ...prevData,
        alaCarteMenu: [...formik.values.alaCarteMenu, defaultMenuItem]
      }));
    }
    if (action === 'Remove') {
      // Create a copy of the array without the item at index i
      const updatedMenu = formik.values.alaCarteMenu.filter((_: _Object, index: number) => index !== i);
      setInitialData(prevData => ({
        ...prevData,
        alaCarteMenu: updatedMenu
      }));
    }
  };

  const handleMultipleIMages = async (e: _Object, i: number) => {
    const file = e?.target?.files && e?.target?.files[0];

    if (file) {
      formik.setFieldValue(`alaCarteMenu[${i}].images`,
        [...formik.values.alaCarteMenu[i].images, file]
      );
      formik.setFieldValue(`alaCarteMenu[${i}].images_url`,
        [...formik.values.alaCarteMenu[i].images_url, await uploadImages(file)]
      );
    }
  };

  const removeImage = (indexToRemove: number, imageIndex: number) => {
    formik.setFieldValue(`alaCarteMenu[${indexToRemove}].images`, formik.values?.alaCarteMenu[indexToRemove]?.images?.filter((image: _Object, index: number) => index !== imageIndex))
    formik.setFieldValue(`alaCarteMenu[${indexToRemove}].images_url`, formik?.values?.alaCarteMenu[indexToRemove]?.images_url?.filter((image: _Object, index: number) => index !== imageIndex))

    if (formik?.values?.alaCarteMenu[indexToRemove]?.imagesDataBaseId?.length > 0) {
      formik.setFieldValue(`alaCarteMenu[${indexToRemove}].imagesDataBaseId`, formik?.values?.alaCarteMenu[indexToRemove]?.imagesDataBaseId?.filter((image: _Object, index: number) => index !== imageIndex))
    }
  }

  const backButton = () => {
    dispatch(venueData({ ...venueState, alaCarteMenu: formik.values.alaCarteMenu }))
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <h5 className="mb-30 text-uppercase">A La Carte Menu</h5>

            {formik?.values?.alaCarteMenu?.map((item: _Object, i: number) => {
              return (
                <>
                  <div className="mb-3">
                    <h5 className="mb-30 text-capitalize" key={i}>Menu {getWordForValue(i + 1)}</h5>

                    <div className="col" key={i}>
                      <InputField
                        className="mb-30"
                        label="Menu Title"
                        required={true}
                        name={`alaCarteMenu[${i}].title`}
                        value={item.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`alaCarteMenu[${i}].title`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.alaCarteMenu && formik.errors.alaCarteMenu && formik.errors.alaCarteMenu[i] && formik.errors.alaCarteMenu[i].title && formik.errors.alaCarteMenu[i].title}
                      />

                      <div className="row" key={i}>
                        <div className="col">
                          <label className="form-label">Upload multiple Menu</label>
                          <div className="d-flex gap-3">
                            {item.images_url?.length > 0 &&
															item.images_url?.map((item: string, index: number) => {
															  return (
															    <div key={index} className="Sketch-close-wrap">
															      <Image src={item} width="100" height="100" alt="tourDetailImg" className="item-img" />
															      <button onClick={() => removeImage(i, index)} type="button" className="border-0">
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
                                onChange={(e: _Object) => handleMultipleIMages(e, i)}
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

                    <div className="d-flex justify-content-between">
                      <Button
                        type="button"
                        className="outline-danger"
                        label="Remove"
                        onClick={() => menuItemCount('Remove', i)}
                        disabled={formik.values.alaCarteMenu.length === 1}
                      ></Button>

                      <Button
                        type="button"
                        className="primary" label="Add NEW"
                        onClick={() => menuItemCount('Add')}
                      />
                    </div>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?step=2` : '/dashboard/venues/create?step=2'} className="btn btn-primary">Back</Link>
        <Button type="submit" label="Continue" className="btn btn-primary" />
      </div>
    </form>
  )
}

export default CarteMenu