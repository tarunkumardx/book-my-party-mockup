/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import * as yup from 'yup'
import { useFormik } from 'formik';

import store from 'store'

import { listService } from '@/services/venue.service';
import { _Object } from '@/utils/types';
import { CarteMenu, DashboardLayout, Facility, Holidays, Loading, Location, MenuItem, PartyPackage, SEOHead, VenueGallery } from '@/components';
import { Button, InputField } from '@/stories/form-inputs';

import Image from 'next/image';
import { icoCheckBadge } from '@/assets/images';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { venueData } from '@/redux/slices/venue.slice';
import { CKEditor } from 'ckeditor4-react';
import { setActivities, setAgeGroups, setAmenities, setCuisines, setFranchiseChain, setLocations, setOccasions, setPropertyRules, setVenueMenuItems, setVenueTypes } from '@/redux/slices/session.slice';

const EditVenue = () => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()

  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { amenities, cuisines, franchiseChain, locations, occasions, venueTypes, activities, ageGroups, venueMenuItems, propertyRules, loggedInUser } = useSelector((state: any) => state.session);

  const [data, setData] = useState<_Object>({});

  const [steps, setSteps] = useState<_Object>(store.get('steps') || {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false
  });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    store.set('steps', steps)
  }, [steps])

  const formik = useFormik({
    initialValues: {
      title: venueState?.title || '',
      description: venueState?.description || '',
      highlights: venueState?.highlights || ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      title: yup.string().label('Title').required('Title is required').min(8, 'Title must be at least 8 characters')
    }),

    onSubmit: async (values) => {
      dispatch(venueData({ ...venueState, title: values.title, description: values.description, highlights: values.highlights }))
      setSteps((prev: _Object) => ({
        ...prev,
        step1: true
      }))
      router.push({
        pathname: `/dashboard/venues/${router?.query?.slug}`,
        query: 'step=1'
      })
    }
  })

  useEffect(() => {
    setLoading(true)

    async function name() {
      const authors = await listService.authorsList()

      const authorIds = authors?.map((item: _Object) => parseInt(item.id));
      const loggedInUserId = loggedInUser?.databaseId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedArray: any = [...authorIds];

      if (loggedInUserId !== undefined && loggedInUserId !== null) {
        mergedArray.push(loggedInUserId);
      }

      dispatch(setVenueMenuItems(mergedArray))
    }

    name()

    dispatch(setAmenities())
    dispatch(setCuisines())
    dispatch(setFranchiseChain())
    dispatch(setLocations())
    dispatch(setVenueTypes())
    dispatch(setOccasions())
    dispatch(setActivities())
    dispatch(setAgeGroups())
    dispatch(setPropertyRules())

    listService.getVenueDetails(router.query.slug, 'DATABASE_ID').then((data: _Object) => {
      if (data?.title) {
        const datesArray = data?.extraOptions?.holidays?.split(',')?.map((date: string) => date.trim());
        dispatch(venueData({
          id: data?.id,
          start_date: datesArray?.length > 0 ? datesArray[0] : null,
          end_date: datesArray?.length > 0 ? datesArray[datesArray.length - 1] : null,
          holidays: datesArray,
          title: formik?.values?.title?.length === 0 ? data?.title : formik?.values?.title,
          description: formik?.values?.description?.length === 0 ? data?.content : formik?.values?.description,
          highlights: formik?.values?.highlights?.length === 0 ? data?.extraOptions?.highlights : formik?.values?.highlights,
          location: data?.locations.nodes?.filter((item: _Object) => item.slug !== 'india')[0]?.slug,
          activities: data?.activities?.nodes?.map((item: _Object) => item.slug),
          ageGroups: data?.ageGroups?.nodes?.map((item: _Object) => item.slug),
          occasions: data?.occasions?.nodes?.map((item: _Object) => item.slug),
          allCuisine: data?.allCuisine?.nodes?.map((item: _Object) => item.slug),
          amenities: data?.amenities?.nodes?.map((item: _Object) => item.slug),
          franchises: data?.franchises?.nodes?.map((item: _Object) => item.slug),
          venueTypes: data?.venueTypes?.nodes?.map((item: _Object) => item.slug),
          capacity: `${data?.extraOptions?.capacity}`,
          propertyRules: data?.extraOptions?.propertyRules?.nodes?.map((item: _Object) => item.databaseId),
          type: data?.venueCategories?.nodes[0]?.slug,
          videoUrl: data?.extraOptions?.mediaGallery?.videoUrl,
          paxPrice: data?.extraOptions?.paxPrice,
          featureImage: data?.featuredImage?.node?.mediaItemUrl,
          featureImageDataBaseId: data?.featuredImage?.node?.databaseId,
          galleryImages: {
            images_url: data?.extraOptions?.mediaGallery?.imageGallery?.map((item: _Object) => item?.items?.node?.mediaItemUrl) || [],
            images: data?.extraOptions?.mediaGallery?.imageGallery || [],
            imagesDataBaseId: data?.extraOptions?.mediaGallery?.imageGallery?.map((item: _Object) => { return { items: item?.items?.node?.databaseId } }) || []
          },
          alaCarteMenu: data?.extraOptions?.alaCarteMenu?.map((item: _Object) => { return { title: item.title, images: item.gallery || [], images_url: item?.gallery?.map((image: _Object) => image?.image?.node?.mediaItemUrl || '') || [], imagesDataBaseId: item?.gallery?.map((image: _Object) => { return { image: image?.image?.node?.databaseId || '' } }) || [] } }),
          menuItems: data?.extraOptions?.menuItems?.map((item: _Object) => { return { item_category: item?.itemCategory?.nodes[0]?.databaseId, item_subcategory: item?.itemSubCategory?.nodes[0]?.databaseId, items: item?.items?.nodes?.map((venueItem: _Object) => venueItem.databaseId) } }),
          address: { ...data?.extraOptions?.address, google_map: data?.extraOptions?.address.googleMap, sub_location: data?.extraOptions?.address?.subLocation },
          package_starting_from: data?.extraOptions?.packageStartingFrom?.map((item: _Object) => ({ package_starting_type: item?.packageStartingType, package_starting_title: item?.packageStartingTitle, package_starting_price: item?.packageStartingPrice })),
          googleReviewsId: data?.extraOptions?.googleReviewsId || '',
          packages: data?.extraOptions?.packages?.map((item: _Object) => {
            const newPackageSettings: _Object = {};
            for (const key in item.packageSettings) {
              // eslint-disable-next-line no-prototype-builtins
              if (item.packageSettings.hasOwnProperty(key)) {
                const innerObject: _Object = item.packageSettings[key];
                const newInnerObject: _Object = {};
                for (const innerKey in innerObject) {
                  // eslint-disable-next-line no-prototype-builtins
                  if (innerObject.hasOwnProperty(innerKey)) {
                    const newInnerKey = 'menuitem_' + innerKey.replace('menuitem', '');
                    newInnerObject[newInnerKey] = innerObject[innerKey];
                  }
                }
                const newKey = 'menuitem_' + key.replace('menuitem', '');
                newPackageSettings[newKey] = newInnerObject;
              }
            }
            return {
              title: item.title,
              price: item.price,
              image: item.image,
              content: item.content,
              image_url: item?.image?.node?.mediaItemUrl,
              imageDataBaseId: item?.image?.node?.databaseId,
              package_settings: newPackageSettings,
              package_settings1: item?.packageSettings1?.map((menuItem: _Object) => ({ items: menuItem?.items, item_category: menuItem?.category?.nodes[0]?.databaseId, item_subcategory: menuItem?.subCategory?.nodes[0]?.databaseId })),
              dietaryPreference: item.dietaryPreference,
              freeCancellation: item.freeCancellation,
              menuDetail: item.menuDetail,
              salePrice: item.salePrice,
              shortDescription: item.shortDescription,
              validOn: item?.validOn?.length > 0 ? item.validOn[0] : '',
              timing: item?.timing?.length > 0 ? item?.timing[0] : '',
              minPax: item.minPax
            };
          })
        }))
        setData(data)
        setLoading(false)
      }
    })
  }, [])

  const stepRouter = (step: number) => {
    if (step === 0) {
      router.push(`/dashboard/venues/${router?.query?.slug}`)
    } else {
      router.push({
        pathname: `/dashboard/venues/${router?.query?.slug}`,
        query: `step=${step}`
      })
    }
  }

  return (
    <DashboardLayout>
      <SEOHead seo={data.seo || ''} />

      <div className="create-venue">
        <h3 className="mb-0">Edit Venue</h3>

        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(0)} className={`nav-link ${steps.step1 && 'success'} ${!router?.query?.step && 'active'}`} type="button" disabled={!steps.step1}>Basic Info
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(1)} className={`nav-link ${steps.step2 && 'success'} ${router?.query?.step == '1' && 'active'}`} type="button" disabled={!steps.step2}>Facilities
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(2)} className={`nav-link ${steps.step3 && 'success'} ${router?.query?.step == '2' && 'active'}`} type="button" disabled={!steps.step3}>Gallery
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(3)} className={`nav-link ${steps.step4 && 'success'} ${router?.query?.step == '3' && 'active'}`} type="button" disabled={!steps.step4}>A La Carte Menu
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          {(venueState?.type === 'banquet' || venueState.type === 'farm-house') &&
						<li className="nav-item" role="presentation">
						  <button onClick={() => stepRouter(4)} className={`nav-link ${steps.step5 && 'success'} ${router?.query?.step == '4' && 'active'}`} type="button" disabled={!steps.step5}>Menu items
						    <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
						  </button>
						</li>
          }

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(5)} className={`nav-link ${steps.step6 && 'success'} ${router?.query?.step == '5' && 'active'}`} type="button" disabled={!steps.step6}>Locations
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(6)} className={`nav-link ${steps.step7 && 'success'} ${router?.query?.step == '6' && 'active'}`} type="button" disabled={!steps.step6}>Party Packages
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button onClick={() => stepRouter(7)} className={`nav-link ${steps.step8 && 'success'} ${router?.query?.step == '7' && 'active'}`} type="button" disabled={!steps.step8}>Holidays
              <Image src={icoCheckBadge} width="16" height="16" alt="CheckBadge" />
            </button>
          </li>

        </ul>

        {
          loading ?
            <div className="d-flex justify-content-center"><Loading /></div>
            :
            <div className="tab-content" id="pills-tabContent">

              {!router?.query?.step &&
								<form onSubmit={formik.handleSubmit} className="tab-pane fade show active">
								  <div className="card">
								    <div className="card-body information">
								      {/* <h6>Personal Information</h6> */}

								      <div className="mb-30">
								        <InputField
								          className="mb-30"
								          label="Title"
								          name="title"
								          required={true}
								          value={formik.values.title}
								          onChange={formik.handleChange}
								          onBlur={formik.handleBlur}
								          error={formik.touched.title && formik.errors.title}
								        />
								      </div>

								      <div className="mb-30">
								        <label className="form-label">Short Intro</label>
								        {!loading && (
								          <CKEditor
								            initData={formik.values.description}
								            onChange={(event) => {
								              const editorData = event.editor.getData(); // Pura data
								              const parser = new DOMParser();
								              const parsedHtml = parser.parseFromString(editorData, 'text/html');
								              const bodyContent = parsedHtml.body.innerHTML; // <body> tag ke andar ka content
								              formik.setFieldValue('description', bodyContent);
								            }}
								            config={{
								              allowedContent: true,
								              fullPage: true
								            }}
								          />
								        )}
								      </div>

								      <div className="mb-30">
								        <label className="form-label">Highlight</label>
								        {!loading && (
								          <CKEditor
								            initData={formik.values.highlights}
								            onChange={(event) => {
								              const editorData = event.editor.getData(); // Pura data
								              const parser = new DOMParser();
								              const parsedHtml = parser.parseFromString(editorData, 'text/html');
								              const bodyContent = parsedHtml.body.innerHTML; // <body> tag ke andar ka content
								              formik.setFieldValue('highlights', bodyContent);
								            }}
								            config={{
								              allowedContent: true,
								              fullPage: true
								            }}
								          />
								        )}
								      </div>

								      <hr />
								    </div>
								  </div>

								  <div className="d-flex justify-content-center continue-btn">
								    <Button type="submit" label="Continue" className="btn btn-primary" />
								  </div>
								</form>
              }

              {router.query.step === '1' && <Facility
                props={{
                  amenities: amenities,
                  cuisines: cuisines,
                  franchiseChain: franchiseChain,
                  locations: locations,
                  occasions: occasions,
                  venueTypes: venueTypes,
                  activities: activities,
                  ageGroups: ageGroups,
                  propertyRules: propertyRules,
                  setSteps: setSteps
                }}
              />}

              {router.query.step === '2' && <VenueGallery props={{ setSteps: setSteps }} />}

              {router.query.step === '3' && <CarteMenu props={{ setSteps: setSteps }} />}

              {router.query.step === '4' && <MenuItem venueMenuItems={venueMenuItems} props={{ setSteps: setSteps }} />}

              {router.query.step === '5' && <Location props={{ setSteps: setSteps, locations: locations }} />}

              {router.query.step === '6' && <PartyPackage venueMenuItems={venueMenuItems} props={{ setSteps: setSteps }} />}

              {router.query.step === '7' && <Holidays />}

            </div>
        }
      </div >
    </DashboardLayout>
  )
}

export default EditVenue