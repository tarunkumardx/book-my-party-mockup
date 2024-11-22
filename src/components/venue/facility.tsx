/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { _Object } from '@/utils/types';
import { Button, RadioButton } from '@/stories/form-inputs';
import { venueData } from '@/redux/slices/venue.slice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';

const Facility = ({ props }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()
  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  const [checkboxData, setCheckboxData] = useState<_Object>({
    amenities: venueState?.amenities || [],
    allCuisine: venueState?.allCuisine || [],
    occasions: venueState?.occasions || [],
    venueTypes: venueState?.venueTypes || [],
    activities: venueState?.activities || [],
    ageGroups: venueState?.ageGroups || [],
    franchises: venueState?.franchises || [],
    capacity: venueState?.capacity || [],
    propertyRules: venueState?.propertyRules || []
  });

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      type: venueState?.type || 'restaurant',
      capacity: venueState?.capacity || '5'
    },

    enableReinitialize: true,

    onSubmit: async (values: _Object) => {
      dispatch(venueData({
        ...venueState,
        type: values.type,
        capacity: values.capacity,
        amenities: checkboxData.amenities,
        allCuisine: checkboxData.allCuisine,
        occasions: checkboxData.occasions,
        venueTypes: checkboxData.venueTypes,
        activities: checkboxData.activities,
        ageGroups: checkboxData.ageGroups,
        franchises: checkboxData.franchises,
        propertyRules: checkboxData.propertyRules
      }))

      props.setSteps((prev: _Object) => ({
        ...prev,
        step2: true
      }))

      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=2'
      })
    }
  })

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, slug: string, fieldName: string): void => {
    const isChecked: boolean = event.target.checked;

    setCheckboxData(prevState => ({
      ...prevState,
      [fieldName]: isChecked
        ? [...prevState[fieldName], slug]
        : prevState[fieldName].filter((item: string) => item !== slug)
    }));
  };

  const capacityOptions = [
    { label: '< 5', value: '5' },
    { label: '6-10', value: '10' },
    { label: '11-15', value: '15' },
    { label: 'up - 150', value: '150' }
  ]

  const backButton = () => {
    dispatch(venueData({
      ...venueState,
      type: formik.values.type,
      capacity: formik.values.capacity,
      amenities: checkboxData.amenities,
      allCuisine: checkboxData.allCuisine,
      occasions: checkboxData.occasions,
      venueTypes: checkboxData.venueTypes,
      activities: checkboxData.activities,
      ageGroups: checkboxData.ageGroups,
      franchises: checkboxData.franchises,
      propertyRules: checkboxData.propertyRules
    }))
  }

  return (
    <form onSubmit={formik.handleSubmit} id="pill-facilities" role="tabpanel" aria-labelledby="FilterTab">
      <div className="card">
        <div className="card-body">
          <h6>Venue Categories</h6>

          <div className="row venue-categories">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <RadioButton
                        value={[formik.values.type]}
                        required={true}
                        options={[
                          { label: 'Restaurant', value: 'restaurant' },
                          { label: 'Banquet', value: 'banquet' },
                          { label: 'Farm House', value: 'farm-house' },
                          { label: 'Fun Zone', value: 'fun-zone' }
                        ]}
                        displayInline={true}
                        onChange={(e: _Object) => {
                          formik.setFieldValue('type', e.target.value)
                          setCheckboxData(prevState => ({
                            ...prevState,
                            allCuisine: [],
                            occasions: [],
                            venueTypes: [],
                            activities: [],
                            ageGroups: [],
                            franchises: [],
                            capacity: []
                          }))
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col amenities">
              <h6>Amenities</h6>

              <div className="row">
                {props?.amenities?.map((item: _Object, i: number) => {
                  return (
                    <div className="col-lg-3" key={i}>
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={item.slug}
                              id={item.slug}
                              checked={checkboxData['amenities'].includes(item.slug)}
                              onChange={(e) => handleCheckbox(e, item.slug, 'amenities')}
                            />
                            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>

          <hr className="mb-30" />

          {
            formik?.values?.type === 'restaurant' &&
						<>
						  <h6>Types</h6>

						  <ul className="list-inline mb-0">
						    {props?.venueTypes?.map((item: _Object, i: number) => {
						      return (
						        <li key={i} className="list-inline-item">
						          <div className="form-check">
						            <input
						              className="form-check-input"
						              type="checkbox"
						              value={item.slug}
						              id={item.slug}
						              checked={checkboxData['venueTypes'].includes(item.slug)}
						              onChange={(e) => handleCheckbox(e, item.slug, 'venueTypes')}
						            />
						            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
						          </div>
						        </li>
						      )
						    })}
						  </ul>

						  <hr className="mb-30" />
						</>
          }

          {
            formik?.values?.type !== 'fun-zone' &&
						<>
						  <h6>Cuisine</h6>

						  <ul className="list-inline mb-0">
						    {props?.cuisines?.map((item: _Object, i: number) => {
						      return (
						        <li key={i} className="list-inline-item">
						          <div className="form-check">
						            <input
						              className="form-check-input"
						              type="checkbox"
						              value={item.slug}
						              id={item.slug}
						              checked={checkboxData['allCuisine'].includes(item.slug)}
						              onChange={(e) => handleCheckbox(e, item.slug, 'allCuisine')}
						            />
						            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
						          </div>
						        </li>
						      )
						    })}
						  </ul>

						  <hr className="mb-30" />
						</>
          }

          {
            formik?.values?.type === 'restaurant' &&
						<>
						  <h6>CHAIN</h6>

						  <ul className="list-inline mb-0">
						    {props?.franchiseChain?.map((item: _Object, i: number) => {
						      return (
						        <li key={i} className="list-inline-item">
						          <div className="form-check">
						            <input
						              className="form-check-input"
						              type="checkbox"
						              value={item.slug}
						              id={item.slug}
						              checked={checkboxData['franchises'].includes(item.slug)}
						              onChange={(e) => handleCheckbox(e, item.slug, 'franchises')}
						            />
						            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
						          </div>
						        </li>
						      )
						    })}
						  </ul>

						  <hr className="mb-30" />
						</>
          }

          {
            (formik?.values?.type === 'restaurant' || formik?.values?.type === 'fun-zone') &&
						<>
						  <h6>Capacity</h6>

						  <div className="row">
						    <div className="col">
						      <div className="form-group">
						        <ul className="list-inline">
						          <li className="list-inline-item">
						            <RadioButton
						              value={[formik.values.capacity]}
						              options={capacityOptions}
						              displayInline={true}
						              onChange={(e: _Object) => {
						                formik.setFieldValue('capacity', e.target.value)
						              }}
						            />
						          </li>
						        </ul>
						      </div>
						    </div>
						  </div>

						  <hr className="mb-30" />
						</>
          }

          <h6>Occasions</h6>

          <ul className="list-inline mb-0">
            {props?.occasions?.map((item: _Object, i: number) => {
              return (
                <li key={i} className="list-inline-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item.slug}
                      id={item.slug}
                      checked={checkboxData['occasions'].includes(item.slug)}
                      onChange={(e) => handleCheckbox(e, item.slug, 'occasions')}
                    />
                    <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
                  </div>
                </li>
              )
            })}
          </ul>

          <hr className="mb-30" />

          {
            formik?.values?.type === 'fun-zone' &&
						<>
						  <h6>Activities</h6>

						  <ul className="list-inline mb-0">
						    {props?.activities?.map((item: _Object, i: number) => {
						      return (
						        <li key={i} className="list-inline-item">
						          <div className="form-check">
						            <input
						              className="form-check-input"
						              type="checkbox"
						              value={item.slug}
						              id={item.slug}
						              checked={checkboxData['activities'].includes(item.slug)}
						              onChange={(e) => handleCheckbox(e, item.slug, 'activities')}
						            />
						            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
						          </div>
						        </li>
						      )
						    })}
						  </ul>

						  <hr className="mb-30" />
						</>
          }

          {
            formik?.values?.type === 'fun-zone' &&
						<>
						  <h6>Age Groups</h6>

						  <ul className="list-inline mb-0">
						    {props?.ageGroups?.map((item: _Object, i: number) => {
						      return (
						        <li key={i} className="list-inline-item">
						          <div className="form-check">
						            <input
						              className="form-check-input"
						              type="checkbox"
						              value={item.slug}
						              id={item.slug}
						              checked={checkboxData['ageGroups'].includes(item.slug)}
						              onChange={(e) => handleCheckbox(e, item.slug, 'ageGroups')}
						            />
						            <label className="form-check-label" htmlFor={item.slug}>{item.name}</label>
						          </div>
						        </li>
						      )
						    })}
						  </ul>

						  <hr className="mb-30" />
						</>
          }

          <h6>Property Rules</h6>

          <ul className="list-inline mb-0">
            {props?.propertyRules?.map((item: _Object, i: number) => {
              return (
                <li key={i} className="list-inline-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item.databaseId}
                      id={item.databaseId}
                      checked={checkboxData['propertyRules'].includes(item.databaseId)}
                      onChange={(e) => handleCheckbox(e, item.databaseId, 'propertyRules')}
                    />
                    <label className="form-check-label" htmlFor={item.databaseId}>{item.title}</label>
                  </div>
                </li>
              )
            })}
          </ul>

          <hr className="mb-30" />
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create'} className="btn btn-primary">Back</Link>
        <Button type="submit" label="Continue" className="btn btn-primary" />
      </div>
    </form>
  )
}

export default Facility