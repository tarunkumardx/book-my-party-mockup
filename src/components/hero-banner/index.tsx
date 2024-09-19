import React, { useEffect, useRef, useState } from 'react'
import { Button, RadioButton } from '@/stories/form-inputs'
import Quantity from '@/stories/form-inputs/quantity/quantity'
import SelectField from '@/stories/form-inputs/select-field'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { _Object } from '@/utils/types'
import { Banquet, Caterers, FarmHouse, FunZone, Restaurant, Banquetc, Caterersc, FarmHousec, FunZonec, Restaurantc, downArrow, location } from '@/assets/images'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router'
import Image from 'next/image'

const HeroBanner = ({ props }: _Object) => {
  console.log(props.locations)
  const router: _Object = useRouter();

  const [locationData, setLocationData] = useState<_Object>({});

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);

  console.log('locationData :>> ', locationData);
  const formik = useFormik({
    initialValues: {
      type: 'restaurant',
      location: 'delhi-ncr',
      locations: [],
      date: '',
      occasion: 'get-together',
      pax: '1'
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      pax: yup.string().label('Pax').required('Pax is required')
    }),

    onSubmit: async (values) => {
      const date = typeof values?.date === 'object' ? new Date(values?.date) : currentDate

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();

      const formattedDate = `${month}-${day}-${year}`;

      router.push({
        pathname: '/venues',
        query: `locations=${values?.location}&types=${values?.type}&date=${formattedDate}&occasions=${values?.occasion}&pax=${values?.pax}&order_by=recommended`
      });
    }
  })

  const locations = [
    { name: 'Popular Destinations', slug: '' }
  ]

  const filteredLocations = locations.filter(data => !props?.locations?.some((item: _Object) => item.slug === data.slug));
  const newLocationsArray = [...filteredLocations, ...props.locations];

  const slugToMove = 'india';

  const newIndex = 1;

  const indexToMove = newLocationsArray.findIndex(item => item.slug === slugToMove);

  const removedElement = newLocationsArray.splice(indexToMove, 1)[0];

  newLocationsArray.splice(newIndex, 0, removedElement);

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

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);

  const openDatePicker = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLDivElement;
    if (target.id === '') {
      setDatePickerIsOpen(!datePickerIsOpen);
      setCalendarOpen(!datePickerIsOpen)
    }
  };

  const [isActive, setIsActive] = useState(false); // State to track active class
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    const target = event.target as HTMLDivElement;
    if (target.id === 'datepicker-herobanner-1' || target.id === 'datepicker-herobanner-11') {
      setCalendarOpen(!datePickerIsOpen)
      setDatePickerIsOpen(!datePickerIsOpen);
    }
  }

  useEffect(() => {
    const fetchLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.log('error :>> ', error);
          }
        );
      }
    };

    fetchLocation();
  }, []);

  return (
    <>
      <section className="hero-banner pie-container">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="main-wrapper">
                <form onSubmit={formik.handleSubmit}>
                  <div className="radios">
                    <RadioButton
                      value={[formik.values.type]}
                      options={[
                        { label: 'Restaurant', value: 'restaurant', image: Restaurant, imagec: Restaurantc },
                        { label: 'Banquet', value: 'banquet', image: Banquet , imagec: Banquetc},
                        { label: 'Farm House', value: 'farm-house', image: FarmHouse, imagec: FarmHousec },
                        { label: 'Fun Zone', value: 'fun-zone', image: FunZone, imagec: FunZonec },
                        { label: 'Caterers', value: 'caterers', image: Caterers, imagec: Caterersc }
                      ]}
                      displayInline={true}
                      onChange={(e: _Object) => {
                        formik.setFieldValue('type', e.target.value)
                        formik.setFieldValue('occasion', e.target.value === 'banquet' ? 'anniversary' : 'get-together')
                      }}
                    />
                  </div>

                  {formik.values.type === 'caterers' ?
                    <div className="output bg-light coming-soon">
                      <h3 className="text-center">COMING SOON</h3>
                    </div>
                    :
                    <div className="output bg-light">
                      <div className="form-inputs">
                        <div className="row">
                          <div className="col-12 col-md-6 col-lg-3 content-box pe-lg-0">
                            <div className="inner location">
                              <SelectField
                                name="location"
                                label="Location"
                                value={{ value: formik?.values?.location }}
                                options={newLocationsArray?.map((item: _Object) => { return item.slug === 'india' ? { label: 'INDIA', value: item.slug } : { label: item.name, value: item.slug, icon: item?.slug?.length > 0 ? location : '' } })}
                                onChange={(val: _Object) => {
                                  formik.setFieldValue('location', val.value)
                                }}
                                getOptionLabel={(option: { [key: string]: string }) => option?.label}
                                getOptionValue={(option: { [key: string]: string }) => option?.label}
                                imageSrc={downArrow}
                              />
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3 content-box p-lg-0">
                            <div className="inner">
                              <div id="datepicker-herobanner-1" className={`form-group ${calendarOpen ? 'active' : ''}`} onClick={handleClick}>
                                <p id="datepicker-herobanner-1" className="label-form" onClick={handleClick}>Date
                                  <Image id="datepicker-herobanner-1" src={downArrow} alt="Image" width={20} height={20} style={{ marginLeft: '60px' }} className="date-arrow" onClick={handleClick} />
                                </p>
                                <ReactDatePicker
                                  id="datepicker-herobanner-11"
                                  name="date"
                                  placeholderText="DD/MM/YYYY"
                                  selected={formik?.values?.date ? new Date(formik.values.date) : currentDate}
                                  onChange={(date: Date) => { formik.setFieldValue('date', date), handleClick({ target: { id: 'datepicker-herobanner-1' } }) }}
                                  dayClassName={(date) => (isPastDate(date) ? 'past-date' : isFutureDate(date) ? 'future-date' : '')}
                                  minDate={currentDate}
                                  dateFormat="dd/MM/YYYY"
                                  open={datePickerIsOpen}
                                  onClickOutside={openDatePicker}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3 content-box p-lg-0">
                            <div className="inner">
                              <SelectField
                                label="Occasion"
                                value={{ value: formik?.values?.occasion }}
                                options={props?.occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                                onChange={(val: _Object) => {
                                  formik.setFieldValue('occasion', val.value)
                                }}
                                getOptionLabel={(option: { [key: string]: string }) => option?.label}
                                getOptionValue={(option: { [key: string]: string }) => option?.label}
                                imageSrc={downArrow}
                              />
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3 content-box ps-lg-0">
                            <div className="inner">
                              <div ref={formGroupRef} className={`form-group ${isActive ? 'active' : ''}`}>
                                <p className="label-form pax-label">Pax</p>
                                <Quantity
                                  value={formik.values.pax}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    formik.setFieldValue('pax', parseInt(e.target.value) <= 0 ? 1 : e.target.value);
                                    setIsActive(true);
                                  }}
                                  decrementQuantity={() => {
                                    formik.setFieldValue('pax', parseInt(formik.values.pax) - 1);
                                    setIsActive(+formik.values.pax > 1);
                                  }}
                                  incrementQuantity={() => {
                                    formik.setFieldValue('pax', parseInt(formik.values.pax) + 1);
                                    setIsActive(true);
                                  }}
                                />
                                {formik.touched.pax && formik.errors.pax ? (
                                  <p className="text-danger mb-0">{formik.touched.pax && formik.errors.pax}</p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ gap: '10%' }} className="search-btn d-flex justify-content-center align-items-center">
                        <Button label="Search" type="submit" className="primary text-center" /> </div>
                    </div>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default HeroBanner