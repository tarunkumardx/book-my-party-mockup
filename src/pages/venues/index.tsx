/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ElfsightWidget } from 'react-elfsight-widget';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup'

import { listService } from '@/services/venue.service';

import { RootState, _Object } from '@/utils/types';
import { dateFormaterForReactDatePicker, truncateText, truncateToWords } from '@/utils/helpers';

import { RedHeart, filterlist, placeholder, wishlistWhite } from '@/assets/images';

import { Layout, SEOHead } from '@/components';

import { Button, CheckBox } from '@/stories/form-inputs';
import Quantity from '@/stories/form-inputs/quantity/quantity';
import SelectField from '@/stories/form-inputs/select-field';
import { getUserWishlist } from '@/redux/slices/session.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import useIsSearchable from '@/components/useIsSearchable';
import { FaRegShareFromSquare } from 'react-icons/fa6';

export const getStaticProps: GetStaticProps = async () => {
  const amenities = await listService.getAmenities()

  const cuisines = await listService.getCuisines()

  const franchiseChain = await listService.getFranchises()

  const locations = await listService.getLocations()

  const occasions = await listService.getOccasions()

  const venueTypes = await listService.getVenueTypes()

  const activities = await listService.getActivities()

  const ageGroups = await listService.getAgeGroups()

  return {
    props: {
      amenities: amenities,
      cuisines: cuisines,
      franchiseChain: franchiseChain,
      locations: locations,
      occasions: occasions,
      venueTypes: venueTypes,
      activities: activities,
      ageGroups: ageGroups
    }
  }
}

const Listing = (props: _Object) => {
  console.log(props);

  const dispatch = useDispatch<AppDispatch>()
  const isSearchable = useIsSearchable();
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);
  const router: _Object = useRouter();
  const { query }: _Object = router;

  const [list, setList] = useState<_Object>({ nodes: [] })
  console.log(list)
  console.log(searchQuery);

  const [cursor, setCursor] = useState<_Object>({
    endCursor: null,
    nextCursor: null
  })
  const [like, setLike] = useState({
    loading: false,
    index: 0
  })
  const [filter, setFilter] = useState(false)
  const [loading, setLoading] = useState<_Object>({
    loader: false,
    main: false,
    firstLoading: true
  })

  // Function for toggle filters
  const [activeAccordion, setActiveAccordion] = useState('price');

  const handleFilterClick = (id: string) => {
    setSearchQuery('');
    setActiveAccordion(id);
  };

  // Add an active css border in the active accordion button
  const getButtonClass = (id: string) => {
    return `accordion-button customPadding mobFilter ${activeAccordion === id ? 'active-button' : ''}`;
  };

  const { userWishlist, isUserLoggedIn } = useSelector((state: RootState) => state.session);

  const locationsOptions = props.locations

  const slugToMove = 'india';

  const newIndex = 0;

  const indexToMove = locationsOptions.findIndex((item: _Object) => item.slug === slugToMove);

  if(indexToMove > -1){
    const removedElement = locationsOptions.splice(indexToMove, 1)[0];
    locationsOptions.splice(newIndex, 0, removedElement);
  }
console.log(list)
  useEffect(() => {
    async function fetchData() {
      const newData = await listService.getVenues(20, cursor.endCursor, null,

        {
          locations: query?.locations?.split('+'),
          types: query?.types?.split('+'),
          cuisines: query?.cuisines?.split('+'),
          franchises: query?.franchises?.split('+'),
          amenities: query?.amenities?.split('+'),
          occasions: query?.occasions?.split('+'),
          priceRange: query?.price_range?.split('+'),
          venueTypes: query?.venueTypes?.split('+'),
          capacity: query?.capacity?.split('+'),
          activities: query?.activities?.split('+'),
          age: query?.age?.split('+'),
          date: query?.date || '',
          package_types: query?.package_types?.split('+'),
          sort: query?.order_by,
          hideVenues: true
        });

      if (filter) {
        setList({ nodes: newData.nodes, pageInfo: newData.pageInfo })
      } else {
        setList({ nodes: newData.nodes?.length > 0 ? [...list.nodes, ...newData.nodes] : [], pageInfo: cursor.endCursor === null ? newData.pageInfo : { ...newData.pageInfo, total: list.pageInfo.total } })
      }

      setLoading({
        loader: false,
        main: false,
        firstLoading: false
      })
    }
    setTimeout(() => {
      const finalDataLocations = locationsOptions.filter((obj: _Object) => query?.locations?.split('+').includes(obj.slug))

      const finalDataOccasions = props.occasions.filter((obj: _Object) => query?.occasions?.split('+').includes(obj.slug))

      if (query?.locations?.split('+')) {
        formik.setFieldValue('locations', finalDataLocations?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
      }

      if (query?.occasions?.split('+')) {
        formik.setFieldValue('occasions', finalDataOccasions?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
      }
    }, 100);

    // if (router?.query?.types) {
    fetchData()
    // }
  }, [router.query, router?.query?.types, cursor.endCursor])

  const shouldApplyMarginTop = activeAccordion !== 'locations' &&
                             activeAccordion !== 'occasions' &&
                             activeAccordion !== 'cuisine' &&
                             activeAccordion !== 'amenities';
  const formik: _Object = useFormik({
    initialValues: {
      type: '',
      location: query?.locations,
      locations: [],
      occasions: [],
      date: router?.query?.date,
      occasion: query?.occasions,
      pax: query.pax || '1'
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      pax: yup.string().label('Pax').required('Pax is required')
    }),

    onSubmit: async (values) => {
      setFilter(true)
      setLoading({ main: true })

      const date = typeof values?.date === 'object' ? new Date(values?.date) : new Date(values?.date)

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();

      const formattedDate = month != 'NaN' ? `${month}-${day}-${year}` : ''

      setList({ nodes: [] })
      setCursor({
        endCursor: null,
        nextCursor: null
      })

      router.push({
        pathname: '/venues',
        query: `locations=${values.location?.replace(/\+/g, '%2B') || ''}&types=${query?.types?.replace(/\+/g, '%2B') || ''}&date=${formattedDate || ''}&occasions=${values?.occasion?.replace(/\+/g, '%2B') || ''}&pax=${values?.pax || ''}&cuisines=${query?.cuisines?.replace(/\+/g, '%2B') || ''}&franchises=${query?.franchises?.replace(/\+/g, '%2B') || ''}&amenities=${query?.amenities?.replace(/\+/g, '%2B') || ''}&price_range=${query?.price_range?.replace(/\+/g, '%2B') || ''}&order_by=${query.order_by}`
      });
    }
  })

  const handleFilters = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setLoading({ main: true })
    setFilter(true)
    setCursor({
      endCursor: null
    })
    if (query[name]) {
      let newValue

      if (query[name].split('+').includes(e.target.value)) {
        const data = query[name].split('+').filter((value: string) => value !== e.target.value);
        newValue = `${data.join('+')}`;
        const finalDataLocations = props.locations.filter((obj: _Object) => data.includes(obj.slug))
        const finalDataOccasions = props.occasions.filter((obj: _Object) => data.includes(obj.slug))

        if (name === 'locations') {
          formik.setFieldValue('locations', finalDataLocations?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
        }

        if (name === 'occasions') {
          formik.setFieldValue('occasions', finalDataOccasions?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
        }
      } else {
        newValue = `${query[name]}+${e.target.value}`
        const data = newValue.split('+')
        const finalData = props.locations.filter((obj: _Object) => data.includes(obj.slug))
        const finalDataOccasions = props.occasions.filter((obj: _Object) => data.includes(obj.slug))

        if (name === 'locations') {
          formik.setFieldValue('locations', finalData?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
        }

        if (name === 'occasions') {
          formik.setFieldValue('occasions', finalDataOccasions?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
        }
      }

      router.push({
        pathname: '/venues',
        query: { ...query, [name]: newValue }
      });
    } else {
      router.push({
        pathname: '/venues',
        query: { ...query, [name]: e.target.value }
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const priceRange = (query.types === 'restaurant' || query.types === 'fun-zone') ? [
    { name: '< 500', slug: '0-500' },
    { name: '500-999', slug: '500-999' },
    { name: '1000-1499', slug: '1000-1499' },
    { name: '1500-1999', slug: '1500-1999' },
    { name: '2000 +', slug: '2000-2000' }
  ] :
    ((query.types === 'banquet')?[
      { name: '< 400', slug: '0-400' },
      { name: '401-600', slug: '401-600' },
      { name: '601-800', slug: '601-800' },
      { name: '801-1000', slug: '801-1000' },
      { name: '1001-1200', slug: '1001-1200' },
      { name: '1201-1400', slug: '1201-1400' },
      { name: '1401-1600', slug: '1401-1600' },
      { name: '1601-1800', slug: '1601-1800' },
      { name: '1801-2000', slug: '1801-2000' },
      { name: '2001-2500', slug: '2001-2500' },
      { name: '2501-3000', slug: '2501-3000' },
      { name: '3000+', slug: '3000-3000' }
    ]:[
      { name: 'Under 400', slug: '0-400' },
      { name: '401 to  600', slug: '401-600' },
      { name: '601 to  800', slug: '601-800' },
      { name: '801 to  1000', slug: '801-1000' },
      { name: '1001 to  1200', slug: '1001-1200' },
      { name: '1201 to  1400', slug: '1201-1400' },
      { name: '1401 to  1600', slug: '1401-1600' },
      { name: '1601 to  1800', slug: '1601-1800' },
      { name: '1801 to  2000', slug: '1801-2000' },
      { name: '2001 to  2500', slug: '2001-2500' },
      { name: '2501 to  3000', slug: '2501-3000' },
      { name: '3000+', slug: '3000-3000' }
    ])

  const capacity = [
    { label: 'upto 50', value: '0-50' },
    { label: 'upto 100', value: '51-100' },
    { label: 'upto 200', value: '101-200' },
    { label: 'upto 300', value: '201-300' },
    { label: 'upto 400', value: '301-400' },
    { label: 'upto 500', value: '401-500' },
    { label: 'upto 1000', value: '501-1000' },
    { label: 'more than 1000', value: '1000-1000' }
  ]

  const loadMore = () => {
    setLoading({ loader: true })
    setFilter(false)
    setCursor({
      endCursor: list.pageInfo.endCursor
    })
  }

  const clearFilter = () => {
    setLoading({ main: true })
    setFilter(true)
    router.push({
      pathname: '/venues',
      query: `locations=${router?.query?.locations?.replace(/\+/g, '%2B') || ''}&types=${router?.query?.types}&date=${router?.query?.date}&occasions=${router?.query?.occasions?.replace(/\+/g, '%2B') || ''}&pax=${router?.query?.pax}&order_by=${router.query.order_by}`
    });
  }

  const isPastDate = (date: number | Date) => {
    const comparisonDate = date instanceof Date ? date : new Date(date);
    return comparisonDate < new Date() && !isToday(comparisonDate);
  };

  // Custom function to set underline for future dates
  const isFutureDate = (date: number | Date) => {
    const comparisonDate = date instanceof Date ? date : new Date(date);
    return comparisonDate > new Date() && !isToday(comparisonDate);
  };

  // Function to check if date is today
  const isToday = (date: { getDate: () => number; getMonth: () => number; getFullYear: () => number }) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const openDatePicker = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLDivElement;
    if (target.id === '') {
      setDatePickerIsOpen(!datePickerIsOpen);
      setCalendarOpen(!datePickerIsOpen)
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    const target = event.target as HTMLDivElement;
    if (target.id === 'datepicker-herobanner-1' || target.id === 'datepicker-herobanner-11') {
      setCalendarOpen(!datePickerIsOpen)
      setDatePickerIsOpen(!datePickerIsOpen);
    }
  }

  const addToWishlist = async (venueId: number, index: number) => {
    if (isUserLoggedIn) {
      setLike({ loading: true, index: index })
      const result = await listService.addToVenueWsihlist(venueId)

      if (result?.success) {
        dispatch(getUserWishlist())
        setTimeout(() => {
          setLike({ loading: false, index: index })
        }, 1500);
      }
    } else {
      const modelId = document.getElementById('login-model-id')
      if (modelId) {
        modelId.click()
      }
    }
  }
  // Share on whatsapp
  const shareOnWhatsApp = (slug: string) => {
    const baseUrl = `${window.location.origin}/venues/${slug}`;
    const fullUrl = `${baseUrl}?locations=${query?.locations?.replace(/\+/g, '%2B')}&date=${query?.date || ''}&types=${query?.types || ''}&occasions=${query?.occasions || ''}&amenities=${query?.amenities || ''}&franchises=${query?.franchises || ''}&cuisines=${query?.cuisines || ''}&price_range=${query?.price_range || ''}&pax=${query?.pax || 1}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout {...props}>
      <SEOHead seo={{ title: 'Venues - Book My Party' } || ''} />

      <section className="search-form search-form-content">
        <div className="container-fluid">
          <form className="row g-2" onSubmit={formik.handleSubmit}>
            <div className="col-6 col-sm-6 col-md-3">
              <div className="inner">
                <SelectField
                  name="location"
                  label="Location"
                  value={{ value: formik?.values?.location?.split('+')[0] }}
                  options={locationsOptions?.map((item: _Object) => { return item.slug === 'india' ? { label: 'INDIA', value: item.slug } : { label: item.name, value: item.slug } })}
                  onChange={(val: _Object) => {
                    formik.setFieldValue('location', val?.value)
                    formik.setFieldValue('locations', [val])
                  }}
                  getOptionLabel={(option: { [key: string]: string }) => option?.label}
                  getOptionValue={(option: { [key: string]: string }) => option?.label}
                  // isClearable
                  isSearchable={isSearchable}
                // isMulti
                />
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-2">
              <div className="inner">
                <div id="datepicker-herobanner-1" className={`form-group ${calendarOpen ? 'active' : ''}`} onClick={handleClick}>
                  <p className="label-form">Date</p>
                  <ReactDatePicker
                    id="datepicker-herobanner-11"
                    name="date"
                    placeholderText="DD/MM/YYYY"
                    dateFormat="dd/MM/YYYY"
                    selected={formik?.values?.date ? dateFormaterForReactDatePicker(formik.values.date) : currentDate}
                    onChange={(date: Date) => { formik.setFieldValue('date', date), handleClick({ target: { id: 'datepicker-herobanner-1' } }) }}
                    dayClassName={(date) => (isPastDate(date) ? 'past-date' : isFutureDate(date) ? 'future-date' : '')}
                    minDate={currentDate}
                    open={datePickerIsOpen}
                    onClickOutside={openDatePicker}
                  />
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-3">
              <div className="inner">
                <SelectField
                  label="Occasion"
                  value={{ value: formik?.values?.occasion?.split('+')[0] }}
                  options={props.occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                  onChange={(val: _Object) => {
                    formik.setFieldValue('occasion', val?.value)
                    formik.setFieldValue('occasions', [val])
                  }}
                  getOptionLabel={(option: { [key: string]: string }) => option?.label}
                  getOptionValue={(option: { [key: string]: string }) => option?.label}
                  // isMulti
                  isSearchable={isSearchable}
                />
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-2">
              <div className="inner">
                <div className="form-group">
                  <p className="label-form pax-label">Pax</p>
                  <Quantity
                    value={formik.values.pax != '1' ? formik.values.pax || 1 : query.pax}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { formik.setFieldValue('pax', parseInt(e.target.value) <= 0 ? 1 : e.target.value) }}
                    decrementQuantity={() => {
                      formik.setFieldValue('pax', parseInt(formik.values.pax != '1' ? formik.values.pax : query.pax) - 1);
                    }}
                    incrementQuantity={() => {
                      formik.setFieldValue('pax', parseInt(formik.values.pax != '1' ? formik.values.pax : query.pax) + 1);
                    }}
                  />
                  {formik.touched.pax && formik.errors.pax ? (<p className="text-danger">{formik.touched.pax && formik.errors.pax}</p>) : null}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="result-list">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-12 col-lg-3">

              <div className="justify-between filter-heading">
                <div className="w-100 d-flex justify-between gap-6">
                  <h4 className="main-head">FILTER BY</h4>
                  {/* <span onClick={() => clearFilter()} style={{ cursor: 'pointer', color: '#482370' }}>Clear Filter</span> */}
                </div>

                <div className="d-flex">
                  {(router?.query?.price_range?.length > 0 || router?.query?.cuisines?.length > 0 || router?.query?.franchises?.length > 0 || router?.query?.amenities?.length > 0 || router?.query?.occasions?.split('+')?.length > 1 || router?.query?.types?.split('+')?.length > 1 || router?.query?.venueTypes?.length > 1 || router?.query?.age?.length > 1 || router?.query?.activities?.length > 1 || router?.query?.package_types?.length > 1) && <Button className="transparent p-0 clear-filter" onClick={() => clearFilter()} label="Clear filter" />}									<button className="btn d-lg-none filter" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilter" aria-controls="offcanvasFilter">
                    <Image src={filterlist} width={20} height={20} alt="" />
                  </button>

                  {/* <div className="dropdown">
										<button className="btn btn-transparent dropdown-toggle p-0 border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											Sort
										</button>
									</div> */}
                  {/* <SelectField
										label="Sort"
										value={{ value: sorting }}
										options={[
											{ label: '-Title', value: '-title' },
											{ label: 'Title', value: 'title' },
											{ label: '-Price', value: '-price' },
											{ label: 'Price', value: 'price' }
										]}
										onChange={(val: _Object) => { setSorting(val.value) }}
										getOptionLabel={(option: { [key: string]: string }) => option?.label}
										getOptionValue={(option: { [key: string]: string }) => option?.label}
									/> */}
                </div>
            </div>
              {/* Testing chat gpt code ends here */}

              {/* side drawer body for filter */}
              <div className="offcanvas-body upperDrawer">
                {/* New functionality here */}
                {/* <div className='left-drawer'>
											<ul className='inputFiledsDrawer'>
												<li>BUDGET / PRICE</li>
												<li>ACTIVITES</li>
												<li>RESTAURANT TYPE</li>
												<li>CUISINE</li>
												<li>RESTRAUNT CHAIN</li>
												<li>LOCATION</li>
												<li>AGE GROUP</li>
												<li>CAPACITY</li>
												<li>AMENITIES</li>
												<li>OCCASIONS</li>
											</ul>
										</div> */}
                <div className="accordion d-none d-md-block" id="accordionFilter">
                  {/* {props?.packageTypes?.filter((item: _Object) =>
												item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
											)?.length > 0 &&
												<div className="accordion-item">
													<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#packageTypes" aria-expanded="true" aria-controls="packageTypes">
														PACKAGE
													</button>

													<div id="packageTypes" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#packageTypes">
														<div className="accordion-body">
															<CheckBox
																showMoreOption={true}
																name="package_types"
																values={router?.query?.package_types?.split('+')}
																options={props?.packageTypes?.filter((item: _Object) =>
																	item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
																)?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
																onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'package_types')}
															/>
														</div>
													</div>
												</div>
											} */}
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#price" aria-expanded="true" aria-controls="price">
                    Budget {(query.types === 'banquet') ? '(PER PAX)': ((query.types != 'restaurant' && query.types != 'fun-zone') ? '(PER PLATE)':'')}
                    </button>

                    <div id="price" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#price">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="price_range"
                          values={router?.query?.price_range?.split('+')}
                          options={priceRange?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'price_range')}
                        />
                      </div>
                    </div>
                  </div>

                  {props?.activities?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#activity" aria-expanded="true" aria-controls="activity">
                        ACTIVITES
                      </button>

                      <div id="activity" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#activity">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="activities"
                            values={router?.query?.activities?.split('+')}
                            options={props?.activities?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'activities')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.ageGroups?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#age" aria-expanded="true" aria-controls="age">
                        AGE GROUP
                      </button>

                      <div id="age" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#age">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="age"
                            values={router?.query?.age?.split('+')}
                            options={props?.ageGroups?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'age')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.venueTypes?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#category" aria-expanded="true" aria-controls="category">
                        RESTAURANT TYPE
                      </button>

                      <div id="category" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#category">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="venueTypes"
                            values={router?.query?.venueTypes?.split('+')}
                            options={props?.venueTypes?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'venueTypes')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.cuisines?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#cuisine" aria-expanded="false" aria-controls="cuisine">
                        Cuisine
                      </button>

                      <div id="cuisine" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#cuisines">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="cuisines"
                            values={router?.query?.cuisines?.split('+')}
                            options={props?.cuisines?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'cuisines')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.franchiseChain?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#restaurantChain" aria-expanded="true" aria-controls="restaurantChain">
                        Restaurant Chain
                      </button>

                      <div id="restaurantChain" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#restaurantChains">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="franchises"
                            values={router?.query?.franchises?.split('+')}
                            options={props?.franchiseChain?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'franchises')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.locations?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#locations" aria-expanded="true" aria-controls="locations">
                        Locations
                      </button>

                      <div id="locations" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#locations">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="locations"
                            values={router?.query?.locations?.split('+')}
                            options={props?.locations?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            ).sort((a:_Object, b:_Object) => {
                              const nameA = a.name.toLowerCase();
                              const nameB = b.name.toLowerCase();
                              if (nameA < nameB) return -1;
                              if (nameA > nameB) return 1;
                              return 0;
                            })?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'locations')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {
                    (query?.types === 'restaurant' || query?.types === 'fun-zone') &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#capacity" aria-expanded="true" aria-controls="capacity">
                        CAPACITY
                      </button>

                      <div id="capacity" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#capacity">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="capacity"
                            values={router?.query?.capacity?.split('+')}
                            options={capacity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'capacity')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {props?.amenities?.filter((item: _Object) =>
                    item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                  )?.length > 0 &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#amenities" aria-expanded="true" aria-controls="amenities">
                        Amenities
                      </button>

                      <div id="amenities" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#amenities">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="amenities"
                            values={router?.query?.amenities?.split('+')}
                            options={props?.amenities?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'amenities')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                  {
                    query?.types === 'restaurant' &&
                    <div className="accordion-item">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#occasions" aria-expanded="true" aria-controls="occasions">
                        Occasions
                      </button>

                      <div id="occasions" className="accordion-collapse collapse show customAccD" aria-labelledby="" data-bs-parent="#occasions">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="occasions"
                            values={router?.query?.occasions?.split('+')}
                            options={props?.occasions?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'occasions')}
                          />
                        </div>
                      </div>
                    </div>
                  }

                </div>
              </div>

              {/* <div className="accordion d-none d-lg-inline-none" id="accordionFilter">
                <div className="accordion-item">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#price" aria-expanded="true" aria-controls="price">
                    BUDGET / PRICE
                  </button>

                  <div id="price" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#price">
                    <div className="accordion-body">
                      <CheckBox
                        showMoreOption={true}
                        name="price_range"
                        values={router?.query?.price_range?.split('+')}
                        options={priceRange?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'price_range')}
                      />
                    </div>
                  </div>
                </div>

                {props?.activities?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#activity" aria-expanded="true" aria-controls="activity">
                      ACTIVITES
                    </button>

                    <div id="activity" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#activity">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="activities"
                          values={router?.query?.activities?.split('+')}
                          options={props?.activities?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'activities')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.ageGroups?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ageGroup" aria-expanded="true" aria-controls="ageGroup">
                      AGE GROUP
                    </button>

                    <div id="ageGroup" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#ageGroup">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="age"
                          values={router?.query?.age?.split('+')}
                          options={props?.ageGroups?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'age')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.venueTypes?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#category" aria-expanded="true" aria-controls="category">
                      RESTAURANT TYPE
                    </button>

                    <div id="category" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#category">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="venueTypes"
                          values={router?.query?.venueTypes?.split('+')}
                          options={props?.venueTypes?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'venueTypes')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.cuisines?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#cuisine" aria-expanded="false" aria-controls="cuisine">
                      Cuisine
                    </button>

                    <div id="cuisine" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#cuisines">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="cuisines"
                          values={router?.query?.cuisines?.split('+')}
                          options={props?.cuisines?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'cuisines')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.franchiseChain?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#restaurantChain" aria-expanded="true" aria-controls="restaurantChain">
                      Restaurant Chain
                    </button>

                    <div id="restaurantChain" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#restaurantChains">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="franchises"
                          values={router?.query?.franchises?.split('+')}
                          options={props?.franchiseChain?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          checked={false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'franchises')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.locations?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#locations" aria-expanded="true" aria-controls="locations">
                      Locations
                    </button>

                    <div id="locations" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#locations">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="locations"
                          values={router?.query?.locations?.split('+')}
                          options={props?.locations?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          checked={false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'locations')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {
                  (query.types === 'restaurant' || query.types === 'fun-zone') &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#capacity" aria-expanded="true" aria-controls="capacity">
                      CAPACITY
                    </button>

                    <div id="capacity" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#capacity">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="capacity"
                          values={router?.query?.capacity?.split('+')}
                          options={capacity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'capacity')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {props?.amenities?.filter((item: _Object) =>
                  item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                )?.length > 0 &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#amenities" aria-expanded="true" aria-controls="amenities">
                      Amenities
                    </button>

                    <div id="amenities" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#amenities">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="amenities"
                          values={router?.query?.amenities?.split('+')}
                          options={props?.amenities?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          checked={false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'amenities')}
                        />
                      </div>
                    </div>
                  </div>
                }

                {
                  query?.types === 'restaurant' &&
                  <div className="accordion-item">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#occasions" aria-expanded="true" aria-controls="occasions">
                      Occasions
                    </button>

                    <div id="occasions" className="accordion-collapse collapse show" aria-labelledby="" data-bs-parent="#occasions">
                      <div className="accordion-body">
                        <CheckBox
                          showMoreOption={true}
                          name="occasions"
                          values={router?.query?.occasions?.split('+')}
                          options={props?.occasions?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                          )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                          checked={false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'occasions')}
                        />
                      </div>
                    </div>
                  </div>
                }
              </div> */}
            </div>

            <div className="col-12 col-lg-9">
              <div className="d-flex justify-content-between align-items-center result-head">
                {(loading.main || loading.firstLoading) ?
                  <h5 className="card-title placeholder-glow col-2">
                    <span className="placeholder col-12"></span>
                  </h5>
                  :
                  <h4 className="d-flex">{list?.pageInfo?.total} Results found</h4>
                }
                {(loading.main || loading.firstLoading) ?
                  <h5 className="card-title placeholder-glow col-2">
                    <span className="placeholder col-12"></span>
                  </h5>
                  :
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0 d-none d-md-block">Sort</h6>
                    <SelectField
                      value={{ value: query?.order_by || 'recommended' }}
                      options={[
                        { label: 'Recommended', value: 'recommended' },
                        { label: 'Title - A to Z', value: '-title' },
                        { label: 'Title - Z to A', value: 'title' },
                        { label: 'Price - Low to High', value: '-price' },
                        { label: 'Price - High to Low', value: 'price' }
                      ]}
                      onChange={(val: _Object) => {
                        const date = new Date(query.date)

                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const year = date.getFullYear();

                        const formattedDate = `${month}-${day}-${year}`;
                        setCursor({
                          endCursor: null
                        })

                        setFilter(true)
                        setLoading({ main: true })
                        router.push({
                          pathname: '/venues',
                          query: `locations=${query.locations?.replace(/\+/g, '%2B') || ''}&types=${query?.types?.replace(/\+/g, '%2B') || ''}&date=${formattedDate}&occasions=${query?.occasions?.replace(/\+/g, '%2B') || ''}&pax=${query?.pax || ''}&cuisines=${query?.cuisines?.replace(/\+/g, '%2B') || ''}&franchises=${query?.franchises?.replace(/\+/g, '%2B') || ''}&amenities=${query?.amenities?.replace(/\+/g, '%2B') || ''}&price_range=${query?.price_range?.replace(/\+/g, '%2B') || ''}&order_by=${val.value}`
                        })
                      }}
                      getOptionLabel={(option: { [key: string]: string }) => option?.label}
                      getOptionValue={(option: { [key: string]: string }) => option?.label}
                      isSearchable={isSearchable}
                    />
                  </div>
                }
              </div>

              {loading.main &&
                <div className="card" aria-hidden="true">
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col-sm-12 col-md-4">
                        <div className="image-wraper placeholder-glow">
                          <p className="placeholder w-100 h-100 mb-0" />
                        </div>
                      </div>
                      <div className="col-sm-8 col-md-5">
                        <div className="details">
                          <p className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                          </p>
                          <p className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                          </p>
                          <div className="review">
                            <ul className="list-inline mb-0 placeholder-glow">
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                            </ul>
                          </div>
                          <p className="placeholder-glow">
                            <span className="placeholder col-11"></span>
                            <span className="placeholder col-11"></span>
                          </p>
                        </div>
                      </div>
                      <div className="col-sm-4 col-md-3 placeholder-glow">
                        <div className="price-details">
                          <h5 className="placeholder col-7"></h5>
                          <Link href="#" className="btn btn-primary placeholder col-6 h-25"></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {!loading.main && !loading.firstLoading && list?.nodes?.length > 0 && list?.nodes?.map((item: _Object, i: number) => {
                console.log(item)
                return (
                  <div className="card" key={i}>
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-sm-12 col-md-4">
                          <div className="image-wraper">
                            <Link href={`/venues/${item.slug}?locations=${query?.locations?.replace(/\+/g, '%2B')}&date=${query?.date || ''}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${router?.query?.pax || 1}`} target="_blank">
                              <Image src={item?.featuredImage?.node?.sourceUrl || placeholder} width="450" height="300" alt="" />

                            </Link>
                            <button disabled={like.loading} onClick={() => addToWishlist(item.databaseId, i)} className="btn wishlist">
                              {like.loading && like.index === i ?
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                :
                                <Image src={userWishlist?.some((wishlist: _Object) => wishlist.id === `${item.databaseId}`) ? RedHeart : wishlistWhite} alt="" width="22" height="22" />
                              }
                            </button>
                            <FaRegShareFromSquare onClick={() => shareOnWhatsApp(item.slug)} className="share-btn" size={22} style={{ position: 'absolute', top: '60px', right: '23px', zIndex: '1', cursor: 'pointer' }} color="white" />
                          </div>
                        </div>
                        <div className="col-sm-8 col-md-5">
                          <div className="details">
                            <h5 >
                              <Link className="" href={`/venues/${item.slug}?locations=${query?.locations?.replace(/\+/g, '%2B')}&date=${query?.date || ''}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${router?.query?.pax || 1}`} target="_blank">
                                {item.title}
                              </Link>
                            </h5>
                            <div className="d-flex gap-2"><img alt="" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" style={{ color: 'transparent', marginTop: '4px' }} src="/_next/static/media/location-icon.b4a02ae7.svg" />
                              <p >{truncateText(item?.extraOptions?.address?.address || '')}</p>
                            </div>

                            {
                              item?.extraOptions?.googleReviewsId &&
                              <div className="google-star-ratings">
                                <ElfsightWidget widgetId={item?.extraOptions?.googleReviewsId} />
                              </div>
                            }
                            <div className="" dangerouslySetInnerHTML={{ __html: truncateToWords(item?.content || '') }} />
                            {/* {cuisineData?.length > 0 && <p><b>Cuisine serve:</b> {cuisineData.map((item: string) => item).join(', ')}</p>} */}
                            <div className="d-flex gap-2 align-items-center">
                            {item?.allCuisine?.nodes.length > 0 && router?.query?.types!=='fun-zone' &&
                              <>
                                <strong>Cuisine Served:</strong> <div>
                                  {item.allCuisine.nodes.slice(0, 3).map((cuisine:_Object) => (
                                    <span
                                      key={cuisine.slug}
                                    >
                                      {cuisine.name + ', '}
                                    </span>
                                  ))}
                                </div>
                              </>
                            }
                             {item?.activities?.nodes.length > 0 && router?.query?.types==='fun-zone' &&
                              <>
                                <strong>Activities:</strong> <div>
                                  {item.activities.nodes.slice(0, 3).map((activity:_Object) => (
                                    <span
                                      key={activity.slug}
                                    >
                                      {activity.name + ', '}
                                    </span>
                                  ))}
                                </div>
                              </>}

                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4 col-md-3">
                          <div className="price-details">
                            {item?.extraOptions?.paxPrice > 0 && <h4>₹{item.extraOptions.paxPrice || 0} / Pax</h4>}
                            <Link href={`/venues/${item.slug}?locations=${query?.locations?.replace(/\+/g, '%2B')}&date=${query?.date || ''}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${formik?.values?.pax || 1}`} className="btn btn-primary" target="_blank">View Venue</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              }

              {!loading?.main && !loading?.firstLoading && list?.nodes?.length === 0 &&
                <div className="results-not-found">
                  <h3>Could not find any results.</h3>
                </div>
              }

              {loading?.firstLoading &&
                <div className="card" aria-hidden="true">
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="image-wraper placeholder-glow">
                          <p className="placeholder w-100 h-100 mb-0" />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="details">
                          <p className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                          </p>
                          <p className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                          </p>
                          <div className="review">
                            <ul className="list-inline mb-0 placeholder-glow">
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                              <li className="list-inline-item">
                                <Image src="" width="15" height="15" alt="" className="placeholder" />
                              </li>
                            </ul>
                          </div>
                          <p className="placeholder-glow">
                            <span className="placeholder col-11"></span>
                            <span className="placeholder col-11"></span>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3 placeholder-glow">
                        <div className="price-details">
                          <h5 className="placeholder col-7"></h5>
                          <Link href="#" className="btn btn-primary placeholder col-6 h-25"></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {list?.pageInfo?.hasNextPage && !loading?.main &&
                <Button label="Load More" loading={loading?.loader} onClick={loadMore} className="primary mx-auto" />
              }
            </div>
          </div>
        </div>
      </section>

      <div className="offcanvas offcanvas-start filter-offcanvas" tabIndex={-1} id="offcanvasFilter" aria-labelledby="offcanvasFilterLabel">
                  <div className="offcanvas-header filterBoxHeader">
                    <button type="button" className="topCloseBtn" data-bs-dismiss="offcanvas" aria-label="">Back</button>
                    <button onClick={() => clearFilter()} type="button" className="ms-auto topClearBtn">Clear Filter</button>
                  </div>
                  <div className="filter-container">

                    <div className="filter-buttons">
                      <div className="accordion-item">
                        <button className={getButtonClass('price')} onClick={() => handleFilterClick('price')} type="button" data-bs-target="#price" aria-expanded={activeAccordion === 'price'} aria-controls="price">
                        BUDGET {(query.types === 'banquet') ? '(PER PAX)': ((query.types != 'restaurant' && query.types != 'fun-zone') ? '(PER PLATE)':'')}
                        </button>
                      </div>

                      {props?.activities?.filter((item: _Object) =>
                        item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                      )?.length > 0 && (
                          <div className="accordion-item">
                            <button className={getButtonClass('activity')} onClick={() => handleFilterClick('activity')} type="button" data-bs-target="#activity" aria-expanded={activeAccordion === 'activity'} aria-controls="activity">
                              ACTIVITIES
                            </button>
                          </div>
                        )}

                      {props?.venueTypes?.filter((item: _Object) => item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types))?.length > 0 && <button onClick={() => handleFilterClick('category')} className={getButtonClass('category')} type="button" data-bs-target="#category" aria-expanded={activeAccordion === 'category'} aria-controls="category">
                        RESTAURANT TYPE
                      </button>
                      }

                      {props?.cuisines?.filter((item: _Object) => item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types))?.length > 0 &&
                        <div className="accordion-item">
                          <button onClick={() => handleFilterClick('cuisine')} className={getButtonClass('cuisine')} type="button" data-bs-target="#cuisine" aria-expanded={activeAccordion === 'cuisine'} aria-controls="cuisine">
                            CUISINES
                          </button>
                        </div>
                      }
                      {
                        props?.franchiseChain?.filter((item: _Object) => item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types))?.length > 0 &&
                        <button onClick={() => handleFilterClick('restaurantChain')} className={getButtonClass('restaurantChain')} type="button" data-bs-target="#restaurantChain" aria-expanded={activeAccordion === 'restaurantChain'} aria-controls="restaurantChain">
                          RESTRAUNT CHAIN
                        </button>
                      }
                      {
                        props?.locations
                          ?.filter((item: _Object) =>
                            item?.filtersOptions?.displayAt?.nodes?.some(
                              (node: _Object) => node?.slug === router?.query?.types
                            )
                          ).sort((a:_Object, b:_Object) => {
                            const nameA = a.name.toLowerCase();
                            const nameB = b.name.toLowerCase();
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                            return 0;
                          })
                          ?.length > 0 && (
                          <button
                            onClick={() => handleFilterClick('locations')}
                            className={getButtonClass('locations')}
                            type="button"
                            data-bs-target="#locations"
                            aria-expanded={activeAccordion === 'locations'}
                            aria-controls="locations"
                          >
                            LOCATIONS
                          </button>
                        )
                      }
                      {
                        (query?.types === 'restaurant' || query?.types === 'fun-zone') && <button onClick={() => handleFilterClick('capacity')} className={getButtonClass('capacity')} type="button" data-bs-target="#capacity" aria-expanded={activeAccordion === 'capacity'} aria-controls="capacity">
                          CAPACITY
                        </button>
                      }
                      {
                        props?.amenities?.filter((item: _Object) => item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types))?.length > 0 && <button onClick={() => handleFilterClick('amenities')} className={getButtonClass('amenities')} type="button" data-bs-target="#amenities" aria-expanded={activeAccordion === 'amenities'} aria-controls="amenities">
                          AMENITIES
                        </button>
                      }
                      {
                        query?.types === 'restaurant' &&
                        <div className="accordion-item">
                          <button onClick={() => handleFilterClick('occasions')} className={getButtonClass('occasions')} type="button" data-bs-target="#occasions" aria-expanded={activeAccordion === 'occasions'} aria-controls="occasions">
                            OCCASIONS
                          </button>
                        </div>
                      }

                    </div>

                    <div className="filter-content">
                      {/* Conditional rendering the search bar */}
                      {activeAccordion === 'locations' && (
                        <div className="form-group searchInput">
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Search Location"
                            onChange={handleSearchChange}
                          />
                        </div>
                      )}
                      {/* Conditional rendering the cuisine */}
                      {
                        activeAccordion === 'cuisine' && (
                          <div className="form-group searchInput">
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder="Search Cuisine"
                              onChange={handleSearchChange}
                            />
                          </div>
                        )
                      }
                      {/* Conditional rendering the cuisine */}
                      {
                        activeAccordion === 'amenities' && (
                          <div className="form-group searchInput">
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder="Search amenities"
                              onChange={handleSearchChange}
                            />
                          </div>
                        )
                      }
                      {/* Conditonal rendering search bar for occasions */}
                      {
                        activeAccordion === 'occasions' && (
                          <div className="form-group searchInput">
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder="Search Occasions"
                              onChange={handleSearchChange}
                            />
                          </div>
                        )
                      }
                    <div className="filterCheckouts" style={shouldApplyMarginTop ? {marginTop: '0'} : {}}>
                      <div id="price" className={`accordion-collapse collapse ${activeAccordion === 'price' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#price">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="price_range"
                            values={router?.query?.price_range?.split('+')}
                            options={priceRange?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'price_range')}
                          />
                        </div>
                      </div>
                      <div id="activity" className={`accordion-collapse collapse ${activeAccordion === 'activity' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#activity">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="activities"
                            values={router?.query?.activities?.split('+')}
                            options={props?.activities?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'activities')}
                          />
                        </div>
                      </div>

                      <div id="category" className={`accordion-collapse collapse ${activeAccordion === 'category' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#category">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="venueTypes"
                            values={router?.query?.venueTypes?.split('+')}
                            options={props?.venueTypes?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'venueTypes')}
                          />
                        </div>
                      </div>

                      <div id="cuisine" className={`accordion-collapse collapse ${activeAccordion === 'cuisine' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#cuisines">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="cuisines"
                            values={router?.query?.cuisines?.split('+')}
                            options={props?.cuisines?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.filter((item: _Object) =>
                              item?.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'cuisines')}
                          />
                        </div>
                      </div>

                      <div id="restaurantChain" className={`accordion-collapse collapse ${activeAccordion === 'restaurantChain' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#restaurantChains">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="franchises"
                            values={router?.query?.franchises?.split('+')}
                            options={props?.franchiseChain?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'franchises')}
                          />
                        </div>
                      </div>

                      <div id="locations" className={`accordion-collapse collapse ${activeAccordion === 'locations' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#locations">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="locations"
                            values={router?.query?.locations?.split('+')}
                            options={props?.locations?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node?.slug === router?.query?.types)
                            )?.filter((item: _Object) =>
                              item?.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ).sort((a:_Object, b:_Object) => {
                              const nameA = a.name.toLowerCase();
                              const nameB = b.name.toLowerCase();
                              if (nameA < nameB) return -1;
                              if (nameA > nameB) return 1;
                              return 0;
                            })?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'locations')}
                          />
                        </div>
                      </div>

                      <div id="capacity" className={`accordion-collapse collapse ${activeAccordion === 'capacity' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#capacity">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="capacity"
                            values={router?.query?.capacity?.split('+')}
                            options={capacity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'capacity')}
                          />
                        </div>
                      </div>

                      <div id="amenities" className={`accordion-collapse collapse ${activeAccordion === 'amenities' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#amenities">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="amenities"
                            values={router?.query?.amenities?.split('+')}
                            options={props?.amenities?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.filter((item: _Object) =>
                              item?.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )?.map((item: _Object) => { return { label: item?.name, value: item?.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'amenities')}
                          />
                        </div>
                      </div>

                      <div id="occasions" className={`accordion-collapse collapse ${activeAccordion === 'occasions' ? 'show' : ''}`} aria-labelledby="" data-bs-parent="#occasions">
                        <div className="accordion-body">
                          <CheckBox
                            showMoreOption={true}
                            name="occasions"
                            values={router?.query?.occasions?.split('+')}
                            options={props?.occasions?.filter((item: _Object) =>
                              item?.filtersOptions?.displayAt?.nodes?.some((node: _Object) => node.slug === router?.query?.types)
                            )?.filter((item: _Object) =>
                              item?.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                            checked={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilters(e, 'occasions')}
                          />
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className="bottomResults">
                    <button aria-label="close" data-bs-dismiss="offcanvas" className="bottomBtn">SHOW {list?.pageInfo?.total} RESULTS</button>
                  </div>
                </div>
    </Layout>
  )
}

export default Listing;