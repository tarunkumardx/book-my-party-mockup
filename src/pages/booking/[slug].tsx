/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import moment from 'moment';

import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { bookingService } from '@/services/booking.service';
import { listService } from '@/services/venue.service';

import { Layout, Loading, PhoneNumberField, SEOHead } from '@/components';

import { _Object } from '@/utils/types';
import { SuccessIcon, placeholder } from '@/assets/images';

import SelectField from '@/stories/form-inputs/select-field';
import Quantity from '@/stories/form-inputs/quantity/quantity';
import { Button, CheckBox, InputField, TextArea } from '@/stories/form-inputs';
import { useSelector } from 'react-redux';
import { amountFormat, capitalize, changeDateFormat, formatPhoneNumber } from '@/utils/helpers';
import useIsSearchable from '@/components/useIsSearchable';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

type RootState = {
	session: {
		isUserLoggedIn: boolean;
		loggedInUser: _Object;
	};
};

const Booking = () => {
  const router: _Object = useRouter();
  const isSearchable = useIsSearchable();

  const { loggedInUser, isUserLoggedIn } = useSelector((state: RootState) => state.session);

  const [menuItems, setMenuItems] = useState<_Object>({ items: [] })
  const [venueDetails, setVenueDetails] = useState<_Object>({})
  const [listMenuItems, setListMenuItems] = useState<_Object>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selectData, setSelectData] = useState<_Object>({})
  const [isActive, setIsActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [result, setResult] = useState<_Object>({})
  console.log('result :>> ', result);
  const [showItems, setShowItems] = useState<_Object>({ items: [] })
  const [venueMenuItem, setVenueMenuItem] = useState<_Object>([])
  const [locations, setLocations] = useState<_Object>([])
  const [occasions, setOccasions] = useState<_Object>([])
  const [showPaxModal, setShowPaxModal] = useState(false);
  console.log('occasions', occasions);

  const packageIds: _Object = {
    breakfast: 'input_118',
    lunch: 'input_121',
    'hi-tea': 'input_120',
    dinner: 'input_119'
  }

  const formik: _Object = useFormik({
    initialValues: {
      input_22: 'Mr',
      first_name: '',
      last_name: '',
      input_25: '',
      input_29: '',
      input_30: '',
      input_31: router?.query?.package,
      input_32: router?.query?.package ? venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.salePrice ? venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.salePrice : venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.price || 0 : router?.query?.price || 0,
      input_33: venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.minPax ? router?.query?.pax >= venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.minPax ? router?.query?.pax : venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === router?.query?.package)?.minPax : router?.query?.pax || 1,
      input_24: '',
      input_50: '',
      input_42: '',
      input_122: venueDetails?.venueOwnerEmail,
      input_111: capitalize(router?.query?.occasions?.split('+')[0]) || '',
      input_110: changeDateFormat(router?.query?.date, 'form'),
      input_109: router?.query?.locations?.split('+')[0],
      input_112: venueDetails?.databaseId,
      input_113: venueDetails?.title,
      input_114: venueDetails?.author?.node?.databaseId,
      input_124: venueDetails?.extraOptions?.address?.address,
      input_134: venueDetails?.extraOptions?.bookingStatus || 'Request Received'
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      first_name: yup.string().label('First Name').required('First Name is required').min(4, 'First Name must be at least 4 characters'),
      last_name: yup.string().label('Last Name').required('Last Name is required').min(4, 'Last Name must be at least 4 characters'),
      input_29: yup.string().email().test('atLeastFourCharsAfterAt', 'Email must be at least 4 characters', (value) => {
        if (!value) return true;
        const atIndex = value.indexOf('@');
        return (atIndex !== -1 && value.length - atIndex > 4);
      }).label('Email').required('Email is required'),
      input_30: yup.string().label('Phone Number').required('Phone Number is required').min(10, 'Phone Number must be at least 10 digits'),
      input_24: router?.query.types === 'banquet' || router?.query?.types === 'farm-house' ? yup.string().label('Day Part').required('Day Part is required').min(2, 'Select one option') : yup.string(),
      input_111: yup.string().label('Occasion').required('Occasion is required'),
      input_109: yup.string().label('Location').required('Location is required'),
      input_31: yup.string().label('Package').required('Package is required'),
      input_25: yup.string().label('Time').required('Time is required')
    }),
    onSubmit: async (values: _Object) => {
      console.log(values)
      if (isUserLoggedIn) {
        const datesArray = venueDetails?.extraOptions?.holidays?.split(',')?.map((date: string) => date.trim());

        if (!datesArray?.includes(changeDateFormat(values.input_110))) {
          setLoading(true)
          values['input_28.3'] = values.first_name
          values['input_28.6'] = values.last_name
          values.input_33 = formik?.values.input_33 || 1
          values.input_30 = formik?.values?.input_30?.includes('+') ? formik?.values.input_30 : formatPhoneNumber(formik?.values.input_30)
          values.input_116 = (formik?.values.input_32 * (formik?.values.input_33 || 1) * 0.05)?.toFixed(2)
          // eslint-disable-next-line no-unsafe-optional-chaining
          values.input_123 = (formik?.values.input_33 * 25)?.toFixed(2)
          values.input_126 = values?.input_25?.length > 0 ? `${values.input_25} Hrs onwards` : ''

          let venueMenuItemsData = '';

          for (const key in selectData) {
            // eslint-disable-next-line no-prototype-builtins
            if (selectData?.hasOwnProperty(key)) {
              const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              const values = selectData[key].join(', ');
              venueMenuItemsData += `${formattedKey}: ${values},\n`;
            }
          }

          venueMenuItemsData = venueMenuItemsData?.trim().replace(/,$/, '');

          const finalData = {
            ...values,
            [packageIds[values.input_24]]: venueMenuItemsData || '',
            input_32: ((values.input_32 * (values.input_33 || 1)) +
							(values.input_32 * (values.input_33 || 1) * 0.05)).toFixed(2).toString(),
            input_125: ((values.input_32 * (values.input_33 || 1)) +
							(values.input_32 * (values.input_33 || 1) * 0.05) + (formik?.values.input_33 * 25)).toFixed(2).toString(),
            input_115: loggedInUser?.databaseId
          };

          const result = await bookingService.create(finalData, 14)
          if (result.is_valid) {
            setLoading(false)
            toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
            setSelectData({})
            setResult(result)
            setShowModal(true);
            setIsChecked(false)
          } else {
            setLoading(false)
          }
        } else {
          alert('This date is not available for booking')
        }
      } else {
        const modelId = document.getElementById('login-model-id')
        if (modelId) {
          modelId.click()
        }
      }
    }
  });

  const handleSubmit = async (event:_Object) => {
    event.preventDefault();
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.handleSubmit();
      window.alert('fill all the required fields');
    } else {
      formik.handleSubmit();
    }
  };
  useEffect(() => {
    setMainLoading(true)
    async function name() {
      const locations = await listService.getLocations()
      setLocations(locations)
      const occasions = await listService.getOccasions()
      setOccasions(occasions)
      setMainLoading(false)
    }

    name()
    listService.getVenueDetails(`${router.query.slug}`).then(async (data: _Object) => {
      setVenueDetails(data)
      const authors = await listService.authorsList()

      const authorIds = authors?.map((item: _Object) => parseInt(item.id));
      const loggedInUserId = data?.author?.node?.databaseId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedArray: any = [...authorIds];

      if (loggedInUserId !== undefined && loggedInUserId !== null) {
        mergedArray.push(loggedInUserId);
      }
      const venueMenuItems = await listService.getVenueMenuItems(mergedArray);
      setVenueMenuItem(venueMenuItems)

      data?.extraOptions?.menuItems?.forEach((item: _Object) => {
        setMenuItems((prev) => ({
          ...prev,
          items: [...prev.items, ...item?.items?.nodes || []]
        }));

        setShowItems((prev) => ({
          ...prev,
          items: [...prev.items, ...item.itemSubCategory.nodes]
        }));
      });
    })
    name1()

    async function name1() {
      if (loggedInUser?.databaseId) {
        const data = await bookingService.getAll(14, {
          ...{
            page: 1,
            per_page: 10,
            user_id: loggedInUser?.databaseId
          }, user_id: loggedInUser.databaseId
        }, loggedInUser?.roles?.nodes?.some((item: _Object) => item.name != 'author') ? 'user' : 'admin')

        if (data?.entries?.length > 0) {
          const object = data?.entries[0]

          formik.setFieldValue('first_name', object['28.3'])
          formik.setFieldValue('last_name', object['28.6'])
          formik.setFieldValue('input_29', object['29'])
          formik.setFieldValue('input_30', formatPhoneNumber(object['30']))
        }
      }
    }
  }, [loggedInUser?.databaseId])

  const formGroupRef = useRef<HTMLDivElement>(null); // Ref for form-group element

  useEffect(() => {
    // Function to handle clicks outside the form-group
    function handleClickOutside(event: MouseEvent) {
      if (formGroupRef.current && !formGroupRef.current.contains(event.target as Node)) {
        setIsActive(false); // Deactivate the class when clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formGroupRef]);

  useEffect(() => {
    if (showModal) {
      const id = setTimeout(() => {
        setShowModal(false);
      }, 5000);
      // Save the timeout ID so we can clear it if needed
      setTimeoutId(id);
    }

    // Clean up the timeout if the component unmounts or modal is closed manually
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showModal]);
  // const inputId: _Object = {
  // 	'148': 'input_107',
  // 	'150': 'input_55',
  // 	'198': 'input_83',
  // 	'195': 'input_80',
  // 	'218': 'input_103',
  // 	'191': 'input_103',
  // 	'212': 'input_97',
  // 	'185': 'input_67',
  // 	'147': 'input_106',
  // 	'210': 'input_95',
  // 	'183': 'input_75',
  // 	'171': 'input_104',
  // 	'146': 'input_105',
  // 	'154': 'input_49',
  // 	'215': 'input_100',
  // 	'188': 'input_76',
  // 	'209': 'input_94',
  // 	'182': 'input_65',
  // 	'153': 'input_48',
  // 	'213': 'input_98',
  // 	'186': 'input_68',
  // 	'214': 'input_99',
  // 	'187': 'input_69',
  // 	'172': 'input_52',
  // 	'205': 'input_90',
  // 	'178': 'input_61',
  // 	'217': 'input_102',
  // 	'190': 'input_71',
  // 	'199': 'input_84',
  // 	'151': 'input_56',
  // 	'207': 'input_92',
  // 	'180': 'input_63',
  // 	'202': 'input_87',
  // 	'175': 'input_57',
  // 	'200': 'input_85',
  // 	'173': 'input_73',
  // 	'208': 'input_93',
  // 	'181': 'input_64',
  // 	'204': 'input_89',
  // 	'177': 'input_59',
  // 	'193': 'input_78',
  // 	'216': 'input_101',
  // 	'189': 'input_70',
  // 	'196': 'input_81',
  // 	'203': 'input_88',
  // 	'176': 'input_60',
  // 	'194': 'input_79',
  // 	'211': 'input_96',
  // 	'184': 'input_66',
  // 	'206': 'input_91',
  // 	'179': 'input_62',
  // 	'201': 'input_86',
  // 	'174': 'input_74',
  // 	'233': 'input_108',
  // 	'274': 'input_72',
  // 	'335': 'input_117'
  // }

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, value: string, fieldName: string, databaseId: number) => {
    const { checked } = event.target;
    const packageData = venueDetails.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === formik.values.input_31)

    const chooseItems = packageData?.packageSettings1.find((item: _Object) => item.subCategory.nodes[0].databaseId === databaseId)?.items

    if (packageData?.packageSettings1 && chooseItems > 0 && chooseItems === selectData[fieldName]?.length && checked) {
      window.alert(`You are allowed to select only ${chooseItems}`);
    } else if (checked && chooseItems > 0) {
      setSelectData((prev: _Object) => ({
        ...prev,
        [fieldName]: selectData[fieldName] ? [...selectData[fieldName], ...[value]] : [value]
      }));
    } else {
      setSelectData((prev: _Object) => {
        const updatedFieldValues = selectData[fieldName]?.filter((val: string) => val !== value);
        return {
          ...prev,
          [fieldName]: updatedFieldValues
        };
      });
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const goBack = () => {
    router.push({
      pathname: `/venues/${router.query.slug}`,
      query: `locations=${router?.query?.locations}&date=${router?.query?.date}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${router?.query?.pax}`
    })
  }

  const minPax = venueDetails?.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === formik?.values?.input_31)?.minPax || 1
  useEffect(() => {
    if(minPax > router?.query?.pax){
      setShowPaxModal(true);
      console.log(showPaxModal)
    }},[minPax, router?.query?.pax])
  return (
    <Layout {...venueDetails}>
      <div>
        <SEOHead seo={venueDetails?.seo || ''} />

        {showModal && (
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <button onClick={() => { setShowModal(false); formik.resetForm(); }} type="button" className="btn border-0 d-flex justify-content-end" data-bs-dismiss="modal" aria-label="Close">
									X
                </button>
                <div className="text-center">
                  <Image src={SuccessIcon} width={100} height={100} alt="success" />
                </div>
                <div className="text-center">
                  <p>Thank you for your booking.</p>
                  <p>You shall receive the confirmation shortly.</p>
                </div>
                {/* <div className="modal-footer justify-content-center border-0 p-0 mb-3">
									{isUserLoggedIn && <Link href={'/dashboard/bookings'} className="btn border">Order details</Link>}
									<Link href={`/venues?locations=${router?.query?.locations?.split('+')[0] || ''}&date=${router?.query?.date}&types=${router?.query?.types}&occasions=${router?.query?.occasions?.split('+')[0] || ''}`} className="btn btn-primary w-auto">Other venue book</Link>
								</div> */}
              </div>
            </div>
          </div >
        )}
      </div>

      {showPaxModal && (<div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <button onClick={() => { setShowPaxModal(false); }} type="button" className="btn border-0 d-flex justify-content-end" data-bs-dismiss="modal" aria-label="Close">
							X
            </button>
            <div className="text-center">
              <Image src={SuccessIcon} width={100} height={100} alt="success" />
            </div>
            <div className="text-center p-20">
              <strong>Note:- </strong>You have selected a package that requires a minimum of {minPax} Pax
            </div>
          </div>
        </div>
      </div >)}
      <section className="fill-bar">
        <div className="container">
          <div className="row justify-content-center">

            <div className="col-lg-12 col-md-12">
              <div className="row">
                <div className="card">
                  <div className="card-body">
                    <div className="row gx-2">
                      {/* <div className="col-md-6 col-lg-3 col-xl-3">
												<div className="inner booking-inner">
													<SelectField
														name="location"
														label="Location"
														value={{ value: formik?.values?.input_109 }}
														options={(locations && locations && locations?.map((item: _Object) => {
															return item.slug !== 'india' && { label: item.name, value: item.slug };
														}))?.filter(Boolean)} onChange={(val: _Object) => {
															formik.setFieldValue('input_109', val.value)
														}}
														getOptionLabel={(option: { [key: string]: string }) => option?.label}
														getOptionValue={(option: { [key: string]: string }) => option?.label}
														isSearchable={isSearchable}
													/>
												</div>
												{formik.touched.input_109 && formik.errors.input_109 && <span className="text-danger">{formik.touched.input_109 && formik.errors.input_109}</span>}
											</div> */}
                      <div className="col-md-6 col-lg-3 col-xl-3">
                        <div className="inner booking-inner">
                          <p>Location</p>
                          <span>
                            {formik?.values?.input_109 && locations?.find((item: _Object) => item.slug == formik?.values?.input_109)?.name || ''}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3 col-xl-3">
                        <div className="inner booking-inner">
                          <p>Date</p>
                          <span>
                            {router?.query?.date?.length > 0
                              ? changeDateFormat(router.query.date, 'date')
                              : moment(new Date()).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3 col-xl-3">
                        <div className="inner booking-inner">
                          <p>Occasion</p>
                          <span>
                            {capitalize(formik?.values?.input_111)}
                          </span>
                        </div>
                      </div>

                      {/* <div className="col-md-6 col-lg-3 col-xl-3">
												<div className="inner booking-inner">
													<SelectField
														label="Occasion"
														value={{ value: formik?.values?.input_111 }}
														options={occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
														onChange={(val: _Object) => {
															formik.setFieldValue('input_111', val.value)
														}}
														getOptionLabel={(option: { [key: string]: string }) => option?.label}
														getOptionValue={(option: { [key: string]: string }) => option?.label}
														isSearchable={isSearchable}
													/>
												</div>
												{formik.touched.input_111 && formik.errors.input_111 && <span className="text-danger">{formik.touched.input_111 && formik.errors.input_111}</span>}
											</div> */}

                      <div className="col-md-6 col-lg-3 col-xl-3">
                        <div className={`inner booking-inner ${isActive}`}>
                          <p className="pax-label">Pax</p>
                          <Quantity
                            value={formik.values.input_33 || 1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.value >= minPax) {
                                formik.setFieldValue('input_33', parseInt(e.target.value) <= 0 ? 1 : e.target.value);
                                setIsActive(true);
                              } else {
                                alert(`Note:- You have selected a package that requires a minimum of ${minPax} Pax`)
                              }
                            }}
                            decrementQuantity={() => {
                              if (formik?.values?.input_33 > minPax) {
                                formik.setFieldValue('input_33', parseInt(formik.values.input_33) - 1);
                                setIsActive(+formik.values.input_33 > 1);
                              } else {
                                alert(`Note:- You have selected a package that requires a minimum of ${minPax} Pax`)
                              }
                            }}
                            incrementQuantity={() => {
                              formik.setFieldValue('input_33', parseInt(formik.values.input_33) + 1);
                              setIsActive(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {mainLoading &&
							<div className="d-flex justify-content-center align-items-center">
							  <Loading />
							</div>
            }

            <div className="col-lg-12 pb-4 ps-lg-0 ps-md-3">
              <Button onClick={() => goBack()} className="primary back-btn" label="Go back" />
            </div>

          </div>
        </div>
      </section>

      <section className="booking">
        <div className="container">
          <div className="row align-items-start main-row">
            {/* <div className="col-lg-1"></div> */}
            <div className="col-lg">
              <form className="row main-inner-row" onSubmit={handleSubmit}>
                {/* <h1>Booking</h1> */}
                <div className="card">
                  <div className="card-body row">
                    <SelectField
                      className="col-lg-2"
                      name={'input_22'}
                      label="Title"
                      required={true}
                      options={
                        [
                          { label: 'Mr.', value: 'Mr' },
                          { label: 'Mrs.', value: 'Mrs' },
                          { label: 'Ms.', value: 'Ms' },
                          { label: 'Dr.', value: 'Dr' }
                        ]
                      }
                      value={{ value: formik.values.input_22 }}
                      onChange={(e: _Object) => {
                        formik.setFieldValue('input_22', e.value)
                      }}
                      isSearchable={isSearchable}
                      getOptionLabel={(option: { [key: string]: string }) => option?.label}
                      getOptionValue={(option: { [key: string]: string }) => option?.label}
                    />

                    <InputField
                      type="text"
                      className="col-lg-4 label-none"
                      name="first_name"
                      label="First Name"
                      placeholder="First Name"
                      required={true}
                      value={formik.values?.first_name?.length > 0 ? capitalize(formik.values.first_name) : formik.values?.first_name}
                      onChange={formik.handleChange}
                      error={formik.touched.first_name && formik.errors.first_name}
                    />

                    <InputField
                      type="text"
                      className="col label-none"
                      name="last_name"
                      label="Last Name"
                      placeholder="Last Name"
                      required={true}
                      value={formik.values?.last_name?.length > 0 ? capitalize(formik.values.last_name) : formik.values?.last_name}
                      onChange={formik.handleChange}
                      error={formik.touched.last_name && formik.errors.last_name}
                    />

                    <InputField
                      className="col-lg-6 label-none"
                      name="input_29"
                      type="email"
                      label="Email"
                      placeholder="Email"
                      required={true}
                      value={formik.values.input_29}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.input_29 && formik.errors.input_29}
                    />
                    <div className="form-group col-lg-6 label-none">
                      <label className="label-form mb-1">Phone</label>
                      <PhoneNumberField
                        required={true}
                        args={{
                          country: 'in',
                          value: formik.values.input_30 || '+91',
                          onChange: (phone: string) => {
                            if (phone?.length <= 10) {
                              formik.setFieldValue('input_30', phone)
                            }
                          },
                          error: formik.touched.input_30 && formik.errors.input_30
                        }}
                      />
                    </div>

                    <SelectField
                      className="col-lg-4"
                      name="input_31"
                      label="Package"
                      required={true}
                      placeholder="-Select Package-"
                      options={venueDetails?.extraOptions?.packages?.map((item: _Object) => { return { label: item.title, value: item.title?.trim() } })}
                      value={{ value: formik.values.input_31 }}
                      onChange={(e: _Object) => {
                        formik.setFieldValue('input_31', e.value)
                        formik.setFieldValue('input_24', '')
                        const data = venueDetails?.extraOptions?.packages.find((item: _Object) => item.title?.trim() === e.value) || 0

                        formik.setFieldValue('input_32', data?.salePrice ? data?.salePrice : data?.price)
                        formik.setFieldValue('input_33', data?.minPax)
                        setSelectData({})
                      }}
                      getOptionLabel={(option: { [key: string]: string }) => option?.label}
                      getOptionValue={(option: { [key: string]: string }) => option?.label}
                      error={formik.touched.input_31 && formik.errors.input_31}
                      isSearchable={isSearchable}
                    />

                    <div className="col-sm-4">
                      <div className="d-flex align-items-center">
                        <InputField
                          name="input_32"
                          label="Price"
                          type="number"
                          readOnly={true}
                          placeholder="Price"
                          value={formik.values.input_32}
                          onChange={formik.handleChange}
                          error={formik.touched.input_32 && formik.errors.input_32}
                        />
                        <div className="mt-1" style={{ padding: '0 5px' }}>
													X
                        </div>

                        <InputField
                          name="input_33"
                          label="Total Pax"
                          type="number"
                          placeholder=""
                          // readOnly={true}
                          value={formik.values.input_33 || 1}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            function isFloat(str: string) {
                              const num = parseFloat(str);
                              return !isNaN(num) && num.toString() === str && num % 1 !== 0;
                            }

                            const value = e.target.value;

                            if (!isFloat(value) && value >= minPax) {
                              formik.setFieldValue('input_33', parseInt(e.target.value) <= 0 ? 1 : e.target.value);
                            } else {
                              alert(`Note:- You have selected a package that requires a minimum of ${minPax} Pax`)
                            }
                          }}
                          error={formik.touched.input_33 && formik.errors.input_33}
                        />
                      </div>
                    </div>

                    {(router?.query.types === 'banquet' || router?.query?.types === 'farm-house') &&
											<SelectField
											  className="col-lg-4"
											  name="input_24"
											  label="Day Part"
											  required={true}
											  placeholder="__Select__"
											  options={
											    [
											      { label: '__Select__', value: '' },
											      { label: 'Breakfast', value: 'breakfast', id: 'menuitem145' },
											      { label: 'Lunch', value: 'lunch', id: 'menuitem149' },
											      { label: 'Hi-Tea', value: 'hi-tea', id: 'menuitem192' },
											      { label: 'Dinner', value: 'dinner', id: 'menuitem197' }
											    ]
											  }
											  value={{ value: formik.values.input_24 }}
											  onChange={(e: _Object) => {
											    formik.setFieldValue('input_24', e.value)
											    formik.setFieldValue('packageId', e.id)
											    const data = venueMenuItem?.filter((item: _Object) => item.slug === e.value)
											    setListMenuItems(data)
											  }}
											  getOptionLabel={(option: { [key: string]: string }) => option?.label}
											  getOptionValue={(option: { [key: string]: string }) => option?.label}
											  error={formik.touched.input_24 && formik.errors.input_24}
											  isSearchable={isSearchable}
											/>
                    }

                    <div className="col-lg-6">
                      <label className="d-block">Timing (Hours) <span className="text-danger">*</span></label>
                      <TimePicker
                        placeholder="Select timing"
                        className={formik.touched.input_25 && formik.errors.input_25 ? 'invalid' : ''}
                        showHour={true}
                        showMinute={true}
                        showSecond={false}
                        format="HH:mm"
                        onChange={(e: _Object) => {
                          if (e) {
                            formik.setFieldValue('input_25', e?.format('HH:mm'))
                          }
                        }
                        }
                        inputReadOnly
                        placement="bottomRight"
                      />

                      {formik.touched.input_25 && formik.errors.input_25 && <span className="text-danger d-block">{formik.touched.input_25 && formik.errors.input_25}</span>}
                    </div>
                  </div>
                </div>

                {(router?.query.types === 'banquet' || router?.query?.types === 'farm-house') &&
									<>
									  {formik?.values?.input_24?.length > 0 && listMenuItems?.map((item: _Object, i: number) => (
									    <div className="card day-part-details" key={i}>
									      <div className="card-body row gx-2">
									        <h2 className="main-head">CUSTOMIZE YOUR MENU</h2>
									        <p className="main-description">Select Your Choice to finalize menu</p>
									        {item?.children?.nodes?.length > 0 && (
									          <>
									            {item?.children?.nodes?.map((children: _Object, c: number) => {
									              const packageData = venueDetails.extraOptions?.packages?.find((item: _Object) => item.title?.trim() === formik.values.input_31);
									              const fieldName = children.slug
									              const chooseItems = packageData?.packageSettings1?.find((item: _Object) => item.subCategory.nodes[0].databaseId === children.databaseId)?.items

									              return (
									                <>
									                  {showItems?.items?.some((show: _Object) => show?.databaseId === children.databaseId && venueDetails?.extraOptions?.menuItems?.find((value: _Object) => value?.itemSubCategory?.nodes[0].databaseId === children.databaseId)?.items?.nodes?.length > 0)
																			&&
																			<div className="col-lg-3" key={c}>
																			  <p className="list-title">{children.name}</p>
																			  {chooseItems && <small className="d-block choose-option">{`Choose any ${chooseItems}`}</small>}
																			  {children?.foodMenuItems?.nodes?.map((venueMenuItem: _Object, v: number) => {
																			    return (
																			      menuItems?.items?.some((menuItem: _Object) => menuItem.id === venueMenuItem.id) && (
																			        <div key={v} className="form-main">
																			          <label>
																			            <input
																			              type="checkbox"
																			              value={venueMenuItem.title}
																			              name={fieldName}
																			              onChange={(e) => handleCheckboxChange(e, venueMenuItem.title, fieldName, children.databaseId)}
																			              checked={selectData[fieldName]?.includes(venueMenuItem.title)}
																			              disabled={!(chooseItems > 0)}
																			            />
																									&nbsp;{venueMenuItem.title}
																			          </label>
																			        </div>
																			      )
																			    );
																			  })}
																			</div>
									                  }
									                </>
									              );
									            })}
									          </>
									        )}
									      </div>
									    </div>
									  ))}
									</>
                }

                <div className="card special-requests">
                  <div className="card-body row">
                    <div className="col-lg-12">
                      <h4>
												Special request
                      </h4>
                      <br />
                      <span>Special requests are subject to outlet’s availability, may be chargeable & can’t be guaranteed.Decision of the management shall be final and binding</span>
                      <TextArea
                        name="input_42"
                        placeholder="Enter Your"
                        value={formik.values.input_42}
                        onChange={formik.handleChange}
                        error={formik.touched.input_42 && formik.errors.input_42}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {
                  venueDetails?.extraOptions?.propertyRules?.nodes?.length > 0 &&
									<div className="card important-info">
									  <div className="card-header">
									    <h4>Important Information</h4>
									  </div>
									  <div className="card-body">
									    <ul>
									      {venueDetails?.extraOptions?.propertyRules?.nodes?.map((item: _Object, i: number) => {
									        return (
									          <div key={i}>
									            {i < 3 && <li key={i}>{item.title}</li>}
									          </div>
									        )
									      })}
									      <Link href={`/venues/${router.query.slug}?locations=${router?.query?.locations}&date=${router?.query?.date}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${router?.query?.pax}&price=${router?.query.price}&package=${router?.query.package}&scroll=propertyRules`} target="_blank">Read Rules</Link>
									    </ul>
									  </div>
									</div>
                }

                <div className="col-lg-4 gst-section p-0">
                  <CheckBox
                    options={[{ label: 'Enter GST Details', value: 'Enter GST Details' }]}
                    onChange={handleCheckBoxChange}
                  />
                  <InputField
                    name="input_50"
                    placeholder="GST Number"
                    value={formik.values.input_50}
                    onChange={formik.handleChange}
                    error={formik.touched.input_50 && formik.errors.input_50}
                    style={{ display: isChecked ? 'block' : 'none' }}
                  />
                </div>
                {loggedInUser?.roles?.nodes?.some((item: _Object) => item?.name != 'subscriber') && <span className="text-danger p-0">Only customer can create booking!</span>}
                <div className="proceed p-0">
                  <Button disabled={(loading || loggedInUser?.roles?.nodes?.some((item: _Object) => item?.name != 'subscriber'))} loading={loading} label="Book Now" type="submit" />
                </div>
              </form>
            </div>

            <div className="col-lg-3 sticky-top">
              <div className="row">
                <div className="card details-card">
                  <div className="card-body">
                    <div className="property-image">
                      <Image src={venueDetails?.featuredImage?.node?.mediaItemUrl ? venueDetails?.featuredImage?.node?.mediaItemUrl : placeholder} alt="" width={211} height={200} className="w-100" />
                    </div>
                    <div className="property-details">
                      <h5 className="title">
                        {venueDetails?.title}
                      </h5>
                      <div className="overflow-auto" style={{ height: '100px', marginBottom: '20px' }}>
                        <div dangerouslySetInnerHTML={{ __html: venueDetails?.content }} />
                      </div>
                    </div>

                    <div className="price-details">
                      <h6>
                        <b>
													Billing Details
                        </b>
                      </h6>

                      <ul className="list-unstyled mb-0">
                        <li className="justify-between">
                          <h5>{formik?.values.input_32}<span> x </span>{(formik?.values.input_33 || 1)}</h5>
                          <h6>
                            {formik?.values.input_32 === 0 ? 'Free' : amountFormat(`${formik?.values.input_32 * (formik?.values.input_33 || 1)}`)}
                          </h6>
                        </li>

                        <li className="justify-between">
                          <h6>GST Charges (5%)</h6>
                          <h6>
                            {amountFormat(`${((formik?.values.input_32) * (formik?.values.input_33 || 1) * 0.05)}`)}
                          </h6>
                        </li>

                        <li className="justify-between">
                          <h6>Convenience Fee</h6>
                          <h6 className="text-decoration-line-through">
														₹{(formik?.values.input_33 * 25).toFixed(2)}
                          </h6>
                        </li>
                        {/* <li className="justify-between">
													<h6>Coupon Amount</h6>
													<h6>
														- 0.00
													</h6>
												</li> */}

                        <li className="justify-between final-price">
                          <h6><b>Final Price</b></h6>
                          <h6>
                            <b>{formik?.values.input_32 === 0 ? 'Free' : amountFormat(`${(formik?.values.input_32 * (formik?.values.input_33 || 1)) + (formik?.values.input_32) * (formik?.values.input_33 || 1) * 0.05}`)}</b>
                          </h6>
                        </li>
                      </ul>
                      <p className="text-end mt-3 mb-2">Inclusive all Taxes in INR</p>
                    </div>
                  </div>
                </div>
                {/* <div className="card coupon">
									<div className="card-body">
										<small> No coupon codes applicable for this property</small>
										<br />
										<small style={{ background: '#ffe5cd' }}>Gift Cards may be applied in next step</small>
										<div className="d-flex">
											<InputField
												placeholder=""
											/>
											<Button loading={loading} className="primary" type="submit" label="Apply" />
										</div>
									</div>
								</div> */}
              </div>

            </div>
            {/* <div className="col-lg-1"></div> */}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
