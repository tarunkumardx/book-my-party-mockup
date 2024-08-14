import React, { useEffect } from 'react';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { Button, InputField, RadioButton, TextArea } from '@/stories/form-inputs';
import Link from 'next/link';
import { _Object } from '@/utils/types';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { venueData } from '@/redux/slices/venue.slice';

const Location = ({ props }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()

  const { venueState } = useSelector((state: _Object) => state.venueDetails);

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      location: venueState?.location || '',
      address: venueState?.address?.address || '',
      sub_location: venueState?.address?.sub_location || '',
      landmarks: venueState?.address?.landmarks || '',
      google_map: venueState?.address?.google_map || '',
      googleReviewsId: venueState?.googleReviewsId || ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      location: yup.string().label('Location').required('Location is required'),
      address: yup.string().label('Real Address').required('Real Address is required'),
      sub_location: yup.string().label('Sub Location').required('Sub Location is required')
    }),

    onSubmit: async (values) => {
      dispatch(venueData({ ...venueState, location: values.location, address: { address: values.address, google_map: values.google_map, landmarks: values.landmarks, sub_location: values?.sub_location }, googleReviewsId: values.googleReviewsId }))
      props.setSteps((prev: _Object) => ({
        ...prev,
        step6: true
      }))
      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=6'
      })
    }
  })

  const backButton = () => {
    dispatch(venueData({ ...venueState, location: formik.values.location, address: { address: formik.values.address, google_map: formik.values.google_map, landmarks: formik.values.landmarks, sub_location: formik?.values?.sub_location }, googleReviewsId: formik.values.googleReviewsId }))
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card">
        <div className="card-body">

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label className="form-label">Location <span className="text-danger">*</span></label>
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <RadioButton
                      value={[formik.values.location]}
                      options={props?.locations?.filter((item: _Object) => item.slug != 'india')?.map((item: _Object) => ({ label: item.name, value: item.slug }))}
                      displayInline={true}
                      onChange={(e: _Object) => {
                        formik.setFieldValue('location', e.target.value)
                      }}
                      error={formik.touched.location && formik.errors.location}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <InputField
            required={true}
            label="Real Address"
            placeholder="Address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && formik.errors.address}
          />

          <InputField
            required={true}
            label="Sub Location"
            placeholder="Sub Location"
            name="sub_location"
            value={formik.values.sub_location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sub_location && formik.errors.sub_location}
          />

          <InputField
            label="Land Mark"
            placeholder="Land Mark"
            name="landmarks"
            value={formik.values.landmarks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <h5 className="mt-4 mb-3 text-uppercase">Google Review ID</h5>
          <InputField
            required={true}
            label=""
            name="googleReviewsId"
            placeholder="Google Review ID"
            value={formik.values.googleReviewsId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <TextArea
            rows={8}
            label="Location Map Embed"
            placeholder="Location View Map Url"
            name="google_map"
            value={formik.values.google_map}
            onChange={formik.handleChange}
          />

          {/* <label className="form-label">Location Map Code</label>
								<textarea className="form-control mb-30" name="" id="" rows={6}></textarea> */}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?${(venueState?.type === 'banquet' || venueState.type === 'farm-house') ? 'step=4' : 'step=3'}` : `/dashboard/venues/create?${(venueState?.type === 'banquet' || venueState.type === 'farm-house') ? 'step=4' : 'step=3'}`} className="btn btn-primary">Back</Link>
        <Button type="submit" label="Continue" className="btn btn-primary" />
      </div>
    </form>
  )
}

export default Location