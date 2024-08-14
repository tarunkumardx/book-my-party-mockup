import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '@/stories/form-inputs';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { _Object } from '@/utils/types';
import { useRouter } from 'next/router';
import { listService } from '@/services/venue.service';
import { toast } from 'react-toastify';
import { dateFormaterForReactDatePicker, uploadImages } from '@/utils/helpers';

const Holidays = () => {
  const router: _Object = useRouter();

  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  const { loggedInUser } = useSelector((state: _Object) => state.session);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }
  }, [])

  const getDatesBetween = (startDate: string | null, endDate: string | null) => {
    if (startDate != null && endDate != null) {
      const dates = [];
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        dates.push(formattedDate);

        currentDate.setDate(currentDate.getDate() + 1);
      }

      formik.setFieldValue('holidays', dates);
    } else {
      formik.setFieldValue('holidays', []);
    }
  };

  const removeElementAtIndex = (arr: string[], index: number) => {
    if (arr?.length > 0) {
      const newArr = [...arr];
      newArr.splice(index, 1);
      formik.setFieldValue('holidays', newArr);
    }
  }

  const formik: _Object = useFormik({
    initialValues: {
      start_date: venueState?.start_date || null,
      end_date: venueState?.end_date || null,
      holidays: venueState?.holidays || []
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      start_date: yup.date().nullable().label('Start Date'),
      end_date: yup.date()
        .nullable()
        .label('End Date')
        .min(yup.ref('start_date'), 'End date must be equal to or later than start date')
    }),

    onSubmit: async (values: _Object) => {
      setLoading(true)

      const data: _Object = {
        ID: venueState.id,
        allCuisine: venueState?.allCuisine?.map((item: string) => { return { slug: item } }) || [],
        amenities: venueState?.amenities?.map((item: string) => { return { slug: item } }) || [],
        activities: venueState?.activities?.map((item: string) => { return { slug: item } }) || [],
        ageGroups: venueState?.ageGroups?.map((item: string) => { return { slug: item } }) || [],
        occasions: venueState?.occasions?.map((item: string) => { return { slug: item } }) || [],
        venueTypes: venueState?.venueTypes?.map((item: string) => { return { slug: item } }) || [],
        franchises: venueState?.franchises?.map((item: string) => { return { slug: item } }) || [],
        locations: [{ slug: 'india' }, { slug: venueState?.location }],
        holidays: `${values?.holidays?.join(', ')}`,
        venueCategories: [{ slug: venueState?.type }],
        title: venueState?.title,
        content: venueState?.description || '',
        capacity: venueState?.capacity?.length > 0 ? venueState?.capacity : '5',
        googleReviewsId: venueState?.googleReviewsId,
        highlights: venueState?.highlights || '',
        paxPrice: `${venueState?.paxPrice}`,
        address: JSON.stringify(venueState.address),
        package_starting_from: JSON.stringify(venueState.package_starting_from),
        mediaGallery: JSON.stringify({
          video_url: venueState?.videoUrl
        }),
        featuredImage: venueState?.featureImage?.name ? `${await listService.uploadMedia(await uploadImages(venueState?.featureImage))}` : venueState?.featureImage,
        alaCarteMenu: JSON.stringify(venueState?.alaCarteMenu),
        menuItems: JSON.stringify(venueState?.menuItems),
        packages: JSON.stringify(venueState?.packages),
        propertyRules: JSON.stringify(venueState?.propertyRules || []),
        authorId: loggedInUser?.databaseId
      }

      if (router?.query?.slug) {
        const result = await listService.updateVenue(data)

        if (venueState?.galleryImages?.images_url?.length > 0) {
          const images = await Promise.all(
            (venueState?.galleryImages?.images_url ?? [])?.map(async (item: string, i: number) => {
              if ((i + 1) > venueState?.galleryImages?.imagesDataBaseId?.length) {
                return { items: await listService.uploadMedia(item) };
              } else {
                return venueState?.galleryImages?.imagesDataBaseId?.[i];
              }
            })
          );

          data.mediaGallery = JSON.stringify({
            video_url: venueState?.videoUrl,
            image_gallery: images,
            featuredImage: venueState?.featureImage
          })

          await listService.updateVenue({ ...data, mediaGallery: data.mediaGallery })
        }

        if (venueState?.featureImage?.name) {
          data.featuredImage = `${await listService.uploadMedia(await uploadImages(venueState?.featureImage))}`

          await listService.updateVenue({ ...data, featuredImage: `${data.featuredImage}`, ID: result.id })
        }

        if (venueState?.alaCarteMenu?.length > 0) {
          const alaCarteMenu = await Promise.all(venueState?.alaCarteMenu?.map(async (item: _Object) => {
            if (item?.images_url?.length > 0) {
              const images = await Promise.all(
                item?.images_url?.map(async (item1: string, i: number) => {
                  if ((i + 1) > item.imagesDataBaseId?.length) {
                    return { image: await listService.uploadMedia(item1) };
                  } else {
                    return item?.imagesDataBaseId[i];
                  }
                })
              );

              return { title: item.title, gallery: images };
            } else {
              return { title: item.title };
            }
          }));

          data.alaCarteMenu = JSON.stringify(alaCarteMenu)

          await listService.updateVenue({ ...data, alaCarteMenu: data.alaCarteMenu })
        }

        if (venueState?.packages?.length > 0) {
          const packages = await Promise.all(venueState?.packages?.map(async (item: _Object) => {
            if (item?.image?.name) {
              return {
                title: item.title,
                dietary_preference: item.dietaryPreference, price: item.price,
                image: await listService.uploadMedia(item?.image_url),
                package_settings: item.package_settings,
                content: item.content,
                free_cancellation: item.freeCancellation,
                menu_detail: item.menuDetail,
                sale_price: item.salePrice,
                short_description: item.shortDescription,
                valid_on: item.validOn,
                timing: item?.timing || '',
                min_pax: item.minPax

              }
            } else {
              return {
                title: item.title,
                dietary_preference: item.dietaryPreference,
                price: item.price,
                package_settings: item.package_settings,
                package_settings1: item.package_settings1,
                image: item?.imageDataBaseId || '',
                content: item.content,
                free_cancellation: item.freeCancellation,
                menu_detail: item.menuDetail,
                sale_price: item.salePrice,
                short_description: item.shortDescription,
                valid_on: item.validOn,
                timing: item?.timing || '',
                min_pax: item.minPax
              }
            }
          }))

          data.packages = JSON.stringify(packages)

          await listService.updateVenue({ ...data, packages: data.packages })
        }

        if (result?.title) {
          toast.success('Venue updated successfully')
          router.push('/dashboard/venues')
          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        const result = await listService.createVenue(data)
        if (result?.title) {
          if (venueState?.galleryImages?.images_url?.length > 0) {
            const images = await Promise.all(
              venueState?.galleryImages?.images_url?.map(async (item: string) => {
                return { items: await listService.uploadMedia(item) }
              })
            );

            data.mediaGallery = JSON.stringify({
              video_url: venueState?.videoUrl,
              image_gallery: images
            })

            await listService.updateVenue({ ...data, mediaGallery: data.mediaGallery, ID: result.id })
          }

          if (venueState?.featureImage?.name) {
            data.featuredImage = `${await listService.uploadMedia(await uploadImages(venueState?.featureImage))}`

            await listService.updateVenue({ ...data, featuredImage: `${data.featuredImage}`, ID: result.id })
          }

          if (venueState?.alaCarteMenu?.length > 0) {
            const alaCarteMenu = await Promise.all(venueState?.alaCarteMenu?.map(async (item: _Object) => {
              if (item?.images_url?.length > 0) {
                const images = await Promise.all(
                  item?.images_url?.map(async (item1: string) => {
                    return { image: await listService.uploadMedia(item1) };
                  })
                );

                return { title: item.title, gallery: images };
              } else {
                return { title: item.title };
              }
            }));

            data.alaCarteMenu = JSON.stringify(alaCarteMenu)

            await listService.updateVenue({ ...data, alaCarteMenu: data.alaCarteMenu, ID: result.id })
          }

          if (venueState?.packages?.length > 0) {
            const packages = await Promise.all(venueState?.packages?.map(async (item: _Object) => {
              if (item?.image?.name) {
                return {
                  title: item.title,
                  dietary_preference: item.dietaryPreference, price: item.price,
                  image: await listService.uploadMedia(item?.image_url),
                  package_settings: item.package_settings,
                  content: item.content,
                  free_cancellation: item.freeCancellation,
                  menu_detail: item.menuDetail,
                  sale_price: item.salePrice,
                  short_description: item.shortDescription,
                  valid_on: item.validOn,
                  timing: item?.timing || '',
                  min_pax: item.minPax
                }
              } else {
                return {
                  title: item.title,
                  dietary_preference: item.dietaryPreference,
                  price: item.price,
                  package_settings: item.package_settings,
                  package_settings1: item.package_settings1,
                  image: item?.imageDataBaseId || '',
                  content: item.content,
                  free_cancellation: item.freeCancellation,
                  menu_detail: item.menuDetail,
                  sale_price: item.salePrice,
                  short_description: item.shortDescription,
                  valid_on: item.validOn,
                  timing: item?.timing || '',
                  min_pax: item.minPax
                }
              }
            }))

            data.packages = JSON.stringify(packages)

            await listService.updateVenue({ ...data, packages: data.packages, ID: result.id })
          }

          toast.success('Venue created successfully')
          router.push('/dashboard/venues')
          setLoading(false)
        }
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="holidays-wrap">
      <div className="card">
        <div className="card-body">
          <div className="row mb-3 holidays-cols-wrap">
            <h5>Holiday</h5>

            {formik?.values?.holidays?.length > 0 && formik?.values?.holidays?.map((item: string, i: number) => {
              return (
                <div key={i} className="col-2 date-wrap">
                  <span className="btn-outline-primary">{item}
                    <Button onClick={() => removeElementAtIndex(formik?.values?.holidays, i)} label="x" className="btn btn-danger" />
                  </span>
                </div>
              )
            })}
          </div>

          <div className="row mb-3">
            <h5>New Holiday</h5>

            <div className="col-2 date-wrap">
              <span>Start date </span>
              <ReactDatePicker
                id="datepicker-herobanner-11"
                name="start_date"
                placeholderText="DD/MM/YYYY"
                selected={formik?.values?.holidays?.length > 0 ? dateFormaterForReactDatePicker(formik?.values?.holidays[0], 'YYYY-MM-DD') : formik.values.start_date?.length > 0 ? new Date(formik?.values?.start_date) : null}
                onChange={(date: Date) => {
                  const formattedDate = date && `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().padStart(2, '0')}-${date?.getDate().toString().padStart(2, '0')}`;
                  formik.setFieldValue('start_date', date != null ? formattedDate : date);
                  getDatesBetween(date != null ? formattedDate : date, formik.values.end_date)
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
              />
              {formik.touched.start_date && formik.errors.start_date && <span className="text-danger">{formik.touched.start_date && formik.errors.start_date}</span>}
            </div>

            <div className="col-2 date-wrap">
              <span>End date </span>
              <ReactDatePicker
                id="datepicker-herobanner-12"
                name="end_date"
                placeholderText="DD/MM/YYYY"
                selected={formik?.values?.holidays?.length > 0 ? dateFormaterForReactDatePicker(formik?.values?.holidays[formik?.values?.holidays?.length - 1], 'YYYY-MM-DD') : formik.values.end_date?.length > 0 ? new Date(formik.values.end_date) : null}
                onChange={(date: Date) => {
                  const formattedDate = date && `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().padStart(2, '0')}-${date?.getDate().toString().padStart(2, '0')}`;
                  formik.setFieldValue('end_date', date != null ? formattedDate : date);
                  getDatesBetween(formik.values.start_date, date != null ? formattedDate : date)
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
              />
              {formik.touched.end_date && formik.errors.end_date && <span className="text-danger">{formik.touched.end_date && formik.errors.end_date}</span>}
            </div>

            {/* <div className="col-1 holidays-btn">
							<span className="label-hidden">plus</span>
							<Button type="submit" label="+" className="btn btn-primary" />
						</div> */}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?step=6` : '/dashboard/venues/create?step=6'} className="btn btn-primary">Back</Link>
        <Button disabled={loading} type="submit" label={router?.query?.slug ? 'Update Venue' : 'Create Venue'} loading={loading} className="btn btn-primary" />
      </div>
    </form>
  )
}

export default Holidays