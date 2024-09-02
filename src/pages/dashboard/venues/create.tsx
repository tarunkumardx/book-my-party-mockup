/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { CKEditor } from 'ckeditor4-react';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { CarteMenu, DashboardLayout, Facility, Holidays, Location, MenuItem, PartyPackage, SEOHead, VenueGallery } from '@/components';
import { Button, InputField } from '@/stories/form-inputs';
import Image from 'next/image';
import { icoCheckBadge } from '@/assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { _Object } from '@/utils/types';
import { AppDispatch } from '@/redux/store';
import { venueData } from '@/redux/slices/venue.slice';
import { useRouter } from 'next/router';
import { listService } from '@/services/venue.service';
import { GetStaticProps } from 'next';
import { setVenueMenuItems } from '@/redux/slices/session.slice';

export const getStaticProps: GetStaticProps = async () => {
  const amenities = await listService.getAmenities()

  const cuisines = await listService.getCuisines()

  const franchiseChain = await listService.getFranchises()

  const locations = await listService.getLocations()

  const occasions = await listService.getOccasions()

  const venueTypes = await listService.getVenueTypes()

  const activities = await listService.getActivities()

  const ageGroups = await listService.getAgeGroups()

  const propertyRules = await listService.getPropertyRules();

  return {
    props: {
      amenities: amenities,
      cuisines: cuisines,
      franchiseChain: franchiseChain,
      locations: locations,
      occasions: occasions,
      venueTypes: venueTypes,
      activities: activities,
      ageGroups: ageGroups,
      propertyRules: propertyRules
    }
  }
}

const CreateVenue = ({ amenities, cuisines, franchiseChain, locations, occasions, venueTypes, activities, ageGroups, propertyRules }: _Object) => {
  const router: _Object = useRouter();

  const dispatch = useDispatch<AppDispatch>()

  const { venueState } = useSelector((state: _Object) => state.venueDetails);
  const { loggedInUser, venueMenuItems } = useSelector((state: _Object) => state.session);

  const [render, setRender] = useState(false);
  const [steps, setSteps] = useState<_Object>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false
  });

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
      console.log(values)
      dispatch(venueData({ ...venueState, title: values.title, description: values.description, highlights: values.highlights }))
      setSteps((prev: _Object) => ({
        ...prev,
        step1: true
      }))
      router.push({
        pathname: '/dashboard/venues/create',
        query: 'step=1'
      })
    }
  })

  useEffect(() => {
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

    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, [])

  const stepRouter = (step: number) => {
    if (step === 0) {
      router.push('/dashboard/venues/create')
    } else {
      router.push({
        pathname: '/dashboard/venues/create',
        query: `step=${step}`
      })
    }
  }

  // useEffect(() => {
  // 	const handleBeforeUnload = (event: _Object) => {
  // 		// Cancel the default behavior
  // 		event.preventDefault();
  // 		// Standard message to display in the confirmation dialog
  // 		event.returnValue = '';
  // 	};

  // 	const handleRouteChange = (url: string) => {
  // 		// Check if the URL contains a query string
  // 		const hasQueryString = url.includes('?');

  // 		if (url !== '/dashboard/venues/create' || hasQueryString) {
  // 			// If the URL is not /dashboard/venues/create or it has a query string,
  // 			// allow the route change without showing the alert
  // 			return;
  // 		}

  // 		// If the URL is /dashboard/venues/create without a query string,
  // 		// show the alert
  // 		const shouldReload = confirm('Do you want to reload the page? Your changes will be discarded.');
  // 		if (shouldReload) {
  // 			// If the user confirms, allow the page reload
  // 			return;
  // 		} else {
  // 			// If the user cancels, prevent the route change
  // 			router.events.emit('routeChangeError');
  // 			throw 'routeChange aborted.';
  // 		}
  // 	};

  // 	// Listen for beforeunload event to cancel page reload
  // 	window.addEventListener('beforeunload', handleBeforeUnload);
  // 	// Listen for route change event to confirm before route change
  // 	router.events.on('routeChangeStart', handleRouteChange);

  // 	return () => {
  // 		// Clean up event listeners
  // 		window.removeEventListener('beforeunload', handleBeforeUnload);
  // 		router.events.off('routeChangeStart', handleRouteChange);
  // 	};
  // }, []);

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Create Venue - Book My Party' } || ''} />

      <div className="create-venue">
        <h3 className="mb-0">Create Venue</h3>

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
						        {render && (
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
						        {render && (
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
      </div >

    </DashboardLayout >
  )
}

export default CreateVenue