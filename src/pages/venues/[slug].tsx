/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import { GetStaticPaths, GetStaticProps } from 'next'
import { ElfsightWidget } from 'react-elfsight-widget';

import { _Object } from '@/utils/types'

import { useFormik } from 'formik';
import * as yup from 'yup'

import { AlaCarteMenu, Breadcrumb, FAQs, Layout, MenuDetail, SEOHead, SimilarProperty, VenueImageSlider } from '@/components'
import { listService } from '@/services/venue.service'
import Link from 'next/link'
import Image from 'next/image'
import { LocationIcon, SpcialPackage, correctIcon, greenDot, PhoneCall, placeholder, redDot, WhatsappIcon } from '@/assets/images'
import { useRouter } from 'next/router'
import { amountFormat, calculateDiscountPercentage, capitalize, changeDateFormat, isYouTubeUrl, truncateTextMore } from '@/utils/helpers'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { IoShareOutline } from 'react-icons/io5';
import { MdContentCopy } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import Accordion from 'react-bootstrap/Accordion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
// import Quantity from '@/stories/form-inputs/quantity/quantity';
// import SelectField from '@/stories/form-inputs/select-field';
// import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { AppDispatch } from '@/redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { getUserWishlist } from '@/redux/slices/session.slice';
// import moment from 'moment';
// import useIsSearchable from '@/components/useIsSearchable';

export const getStaticPaths: GetStaticPaths = async () => {
	const data: _Object = await listService.getAll();

	const paths = data?.nodes?.map((item: _Object) => `/venues/${item.slug}`) || [];
	return {
		paths,
		fallback: false
	};
};

export const getStaticProps: GetStaticProps = async ({ params }: _Object) => {
	const data = await listService.getVenueDetails(params.slug)

	const locations: _Object = await listService.getLocations()

	const occasions: _Object = await listService.getOccasions()

	return {
		props: {
			data: data,
			locations: locations,
			occasions: occasions
		}
	}
}

const VenueDetails = (props: _Object) => {
	console.log(props)
	// const dispatch = useDispatch<AppDispatch>()
	// const isSearchable = useIsSearchable();

	const router: _Object = useRouter();
	const { query }: _Object = router;
	const [isClient, setIsClient] = useState(false)
	const [disable, setDisable] = useState(false)
	const [images, setImages] = useState([])
	console.log('disable :>> ', disable);
	const [show, setShow] = useState(false)
	// const [like, setLike] = useState(false)
	// const { userWishlist, isUserLoggedIn } = useSelector((state: RootState) => state.session);

	useEffect(() => {
		setIsClient(true)
		const datesArray = props?.data?.extraOptions?.holidays?.split(',')?.map((date: string) => date.trim())

		if (datesArray?.includes(changeDateFormat(query.date))) {
			setDisable(true)
		}
	}, [])

	const [activeLink, setActiveLink] = useState('overview');
	const [loadMore, setLoadMore] = useState(3);
	const [modelData, setModelData] = useState({
		menu: '',
		detail: '',
		tab: ''
	});
	const [isSticky, setIsSticky] = useState(false);

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, sectionId: string) => {
		event.preventDefault();
		setActiveLink(sectionId);
		setIsSticky(true)
		// const container = document.body;
		// const element = document.getElementById(sectionId);
		// container.scrollTop = element?.offsetTop;
		setTimeout(() => {
			const container = document.documentElement; // Use this if `document.body` doesn't work
			const element = document.getElementById(sectionId);

			if (element) {
				container.scrollTop = element.offsetTop + (window.screen.width <= 667 ? (-115) : -130); // Scroll to the correct offset
			} else {
				console.error('Element with specified ID not found.');
			}
		}, 100);

		// const target = document?.getElementById(sectionId);
		// if (target) {
		// 	target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		// }
	};

	let breadcrumbArray

	if (router?.query?.locations?.split(' ')[0]?.length > 0) {
		breadcrumbArray = [
			{
				label: capitalize(router?.query?.locations?.split('+')[0] || ''),
				target: `/venues?locations=${router?.query?.locations?.split('+')[0] || ''}`
			},
			{
				label: props?.data?.title,
				target: router?.query?.slug ? router?.query?.slug : router.asPath.split('/')[2].split('?')[0]
			}
		]
	} else {
		breadcrumbArray = [
			{
				label: props?.data?.title,
				target: router?.query?.slug
			}
		]
	}

	useEffect(() => {
		const elem = document.getElementById('propertyRules');
		if (elem && query?.scroll === 'propertyRules') {
			elem.scrollIntoView();
		}
	})

	useEffect(() => {
		const handleScroll = () => {
			const header = document?.querySelector('.sticky-header') as HTMLElement;
			if (header) {
				const sticky = header.offsetTop;
				if (window?.pageYOffset > sticky) {
					setIsSticky(true);
				} else {
					setIsSticky(false);
				}
			}
		};

		setTimeout(() => {
			const finalDataLocations = props?.locations?.filter((obj: _Object) => query?.locations?.split('+').includes(obj.slug))

			const finalDataOccasions = props?.occasions?.filter((obj: _Object) => query?.occasions?.split('+').includes(obj.slug))

			if (query?.locations?.split('+')) {
				formik.setFieldValue('locations', finalDataLocations?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
			}

			if (query?.occasions?.split('+')) {
				formik.setFieldValue('occasions', finalDataOccasions?.map((item: _Object) => { return { label: item.name, value: item.slug } }))
			}

			window?.addEventListener('scroll', handleScroll);
			return () => {
				window?.removeEventListener('scroll', handleScroll);
			};
		}, 100);
	}, [query]);

	const formik = useFormik({
		initialValues: {
			type: '',
			location: query?.locations,
			locations: [],
			occasions: [],
			date: query?.date,
			occasion: query?.occasions,
			pax: query.pax || 1
		},

		enableReinitialize: true,

		validationSchema: yup.object().shape({
			pax: yup.string().label('Pax').required('Pax is required')
		}),

		onSubmit: async (values) => {
			console.log('values :>> ', values);
		}
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleClick2 = (event: any) => {
		const target = event.target as HTMLDivElement;
		if (target?.id === 'share-button') {
			setShow(!show)
		} else {
			setShow(false)
		}
	}
	// fetch avtive page url
	const fetchURL = () => {
		const activeURL = window.location.href;
		console.log('Active Page URL:', activeURL);

		// Copy the URL to the clipboard
		navigator.clipboard.writeText(activeURL).then(() => {
			console.log('URL copied to clipboard!');
		}).catch(err => {
			console.error('Failed to copy the URL:', err);
		});

		return activeURL;
	};

	// Share active URL code on whatsapp
	const shareOnWhatsApp = () => {
		const activeURL = window.location.href;
		const message = 'I found an amazing venue at BookMyParty, check it out here: ';
		const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + activeURL)}`;

		// Log the WhatsApp URL (optional)
		console.log('WhatsApp Share URL:', whatsappURL);

		// Open the WhatsApp share link in a new tab or window
		window.open(whatsappURL, '_blank');
	};

	return (
		<>
			<SEOHead seo={props?.data} />

			{isClient && (
				<>
					<Layout {...props}>

						<section className="search-form2 position-relative" onClick={(e) => handleClick2(e)}>
							{/* <div className="page-container" onClick={(e) => handleClick2(e)}>
								<form className="row g-2" onSubmit={formik.handleSubmit}>
									<div className="col-12 col-sm-6 col-md-3">
										<div className="inner">
											<SelectField
												name="location"
												label="Location"
												value={formik?.values?.locations}
												options={props?.locations?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
												onChange={(val: _Object) => {
													formik.setFieldValue('location', val?.map((location: _Object) => location.value).join('%2B'))
													formik.setFieldValue('locations', val)
												}}
												getOptionLabel={(option: { [key: string]: string }) => option?.label}
												getOptionValue={(option: { [key: string]: string }) => option?.label}
												isClearable
												isMulti
												isSearchable={isSearchable}
											/>
										</div>
									</div>

									<div className="col-12 col-sm-6 col-md-2">
										<div className="inner">
											<div id="datepicker-herobanner-1" className={`form-group ${calendarOpen ? 'active' : ''}`} onClick={handleClick1}>
												<p className="label-form">Date</p>
												<ReactDatePicker
													id="datepicker-herobanner-11"
													name="date"
													placeholderText="DD/MM/YYYY"
													dateFormat="dd/MM/YYYY"
													selected={formik?.values?.date ? dateFormaterForReactDatePicker(formik.values.date) : new Date()}
													onChange={(date: Date) => { formik.setFieldValue('date', moment(date).format('MM-DD-YYYY')), handleClick1({ target: { id: 'datepicker-herobanner-1' } }) }}
													dayClassName={(date) => (isPastDate(date) ? 'past-date' : isFutureDate(date) ? 'future-date' : '')}
													minDate={new Date()}
													open={datePickerIsOpen}
													onClickOutside={openDatePicker}
												/>
											</div>
										</div>
									</div>

									<div className="col-12 col-sm-6 col-md-3">
										<div className="inner">
											<SelectField
												label="Occasion"
												value={formik?.values?.occasions}
												options={props?.occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
												onChange={(val: _Object) => {
													formik.setFieldValue('occasion', val?.map((occasion: _Object) => occasion.value).join('%2B'))
													formik.setFieldValue('occasions', val)
												}}
												getOptionLabel={(option: { [key: string]: string }) => option?.label}
												getOptionValue={(option: { [key: string]: string }) => option?.label}
												isMulti
												isSearchable={isSearchable}
											/>
										</div>
									</div>

									<div className="col-12 col-sm-6 col-md-2">
										<div className="inner">
											<div className="form-group">
												<p className="label-form pax-label">Pax</p>
												<Quantity
													value={formik.values.pax != 1 ? formik.values.pax || 1 : query.pax}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { formik.setFieldValue('pax', parseInt(e.target.value) <= 0 ? 1 : e.target.value) }}
													decrementQuantity={() => {
														formik.setFieldValue('pax', parseInt(formik.values.pax != 1 ? formik.values.pax : query.pax) - 1);
													}}
													incrementQuantity={() => {
														formik.setFieldValue('pax', parseInt(formik.values.pax != 1 ? formik.values.pax : query.pax) + 1);
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
							</div> */}
						</section>

						<Breadcrumb
							data={breadcrumbArray}
							className="page-container order-container"
						/>
						<section className="masala-lane-location">
							<div className="page-container">
								<div className="row">
									<div className="col-12">
										<div className="d-flex align-items-start headingShare">
											<h2>
												{props?.data?.title}
											</h2>
											<Accordion className="shareBtn">
												<Accordion.Item eventKey="0">
													<Accordion.Header className="custom-accordion-header" style={{ backgroundImage: 'none' }}>
														<IoShareOutline color="#fc6f33" size={20} />
													</Accordion.Header>
													<Accordion.Body>
														<div className="d-flex align-items-start gap-2">
															<li onClick={() => fetchURL()} style={{ listStyle: 'none', cursor: 'pointer' }}>Copy Link</li>
															<MdContentCopy />
														</div>
														<div className="d-flex align-items-start gap-2 mt-2">
															<li onClick={() => shareOnWhatsApp()} style={{ listStyle: 'none', cursor: 'pointer' }}>Share via whatsapp</li>
															<FaWhatsapp color="#36bd49" />
														</div>
													</Accordion.Body>
												</Accordion.Item>
											</Accordion>
										</div>

										<div className="d-flex align-items-center">
											<div className="flex-shrink-0">
												<Image
													src={LocationIcon}
													width="20"
													height="24"
													alt=""
												/>
											</div>
											<div className="flex-grow-1">
												<p>{props?.data?.extraOptions?.address?.subLocation}</p>
											</div>
										</div>

									</div>
									{props?.data?.extraOptions?.googleReviewsId &&
										<div className="col-5">
											<div className="google-ratings" onClick={(e) => handleClick2(e)}>
												<ElfsightWidget widgetId={props?.data?.extraOptions?.googleReviewsId} />
											</div>
										</div>
									}

								</div>
								{/* Dropdown here */}

							</div>
						</section>

						<section className="order-single" onClick={(e) => handleClick2(e)}>
							<div className="page-container" onClick={(e) => handleClick2(e)}>
								<div className="row g-4">
									<div className="venue-image-slider">

										<div className="card">
											<div className="card-body img-wrapper p-0">
												<Image
													src={props?.data?.featuredImage?.node?.mediaItemUrl || placeholder}
													width="500"
													height="390"
													alt=""
													className="w-100"
												/>
											</div>
										</div>
									</div>

									<div className="venue-contain">
										<div className="g-2">

											{props?.data?.extraOptions?.mediaGallery?.videoUrl?.length > 0 && isYouTubeUrl(props?.data?.extraOptions?.mediaGallery?.videoUrl) &&
												<div className="pb-1">
													<div className="card rounded-12">
														<div className="card-body p-0">
															<ReactPlayer
																url={props?.data?.extraOptions?.mediaGallery && props?.data?.extraOptions?.mediaGallery?.videoUrl}
																width="100%"
																height={190}
															/>
														</div>
													</div>
												</div>
											}

											{
												props?.data?.extraOptions?.mediaGallery?.imageGallery?.length > 0 &&
												<div className="view-all-images">
													<div className="card rounded-12">
														<div className="card-body p-0">
															<Image src={props?.data?.extraOptions?.mediaGallery?.imageGallery[0]?.items?.node?.mediaItemUrl || placeholder} width="388" height="190" alt="Menu image" className="w-100 rounded-12" />
															<a href="#" data-bs-toggle="modal" data-bs-target="#VenueImageSliderModal">View all {props?.data?.extraOptions?.mediaGallery?.imageGallery?.length} Images</a>
														</div>
													</div>
												</div>
											}
										</div>
									</div>

									<div className="venue-contain  package-list" onClick={(e) => handleClick2(e)}>
										<div className="row g-2">

											<div>
												<div className="card info-card h-100">
													<div className="card-body p-0">
														{props?.data?.extraOptions?.packageStartingFrom?.length > 0 &&
															<div className="card-starting-price">
																<div>
																	<h6>Package starting from</h6>
																</div>
																<div>
																	<h6> Per Pax</h6>
																</div>
															</div>
														}

														{props?.data?.extraOptions?.packageStartingFrom?.length > 0 &&
															props?.data?.extraOptions?.packageStartingFrom?.map((item: _Object, i: number) => {
																return (
																	<div key={i} className="row">
																		<ul className="list-unstyled mb-0">
																			{
																				item?.packageStartingType != 'Special' &&

																				<li>
																					<div className="veg-card">
																						<div className="d-flex align-items-center">
																							<div className="flex-shrink-0">
																								<Image src={item.packageStartingType === 'Vegetarian' ? greenDot : redDot} width="18" height="18" alt="Green Dot" />
																							</div>
																							<div className="flex-grow-1 ms-2">
																								<h6>
																									{capitalize(item?.packageStartingTitle?.length > 30 ? truncateTextMore(item?.packageStartingTitle) : item?.packageStartingTitle || '')}
																								</h6>
																							</div>
																						</div>

																						<div>
																							<h6>{item?.packageStartingPrice ? amountFormat(item?.packageStartingPrice) : ''}</h6>
																						</div>
																					</div>
																				</li>
																			}
																			{item?.packageStartingType == 'Special' &&
																				<li>
																					<div className="spcial-package-card">
																						<div className="d-flex align-items-center">
																							<div className="flex-shrink-0">
																								<Image src={SpcialPackage} width="24" height="24" alt="Spcial Package" />
																							</div>
																							<div className="flex-grow-1 ms-2">
																								<h6>
																									{capitalize(item?.packageStartingTitle?.length > 30 ? truncateTextMore(item?.packageStartingTitle, 30) : item?.packageStartingTitle || '')}
																								</h6>
																							</div>
																						</div>

																						<div>
																							<h6>{item?.packageStartingPrice ? amountFormat(item?.packageStartingPrice) : ''}</h6>
																						</div>
																					</div>
																				</li>
																			}

																		</ul>

																	</div>
																)
															})
														}

														<div className="row">
															<ul className="list-unstyled mb-0">
																<li className="cuisines-served-list">
																	<div className="view-all-row">
																		<a href="#propertyRules" className="btn btn-primary" onClick={(e) => handleClick(e, 'partyPackage')}>
																			View All
																		</a>

																		<div className="view-all-button">
																			<div className="whatsapps">
																				<Link href="https://api.whatsapp.com/send/?phone=%2B919818000526&text&type=phone_number&app_absent=0" target="_self">
																					<Image src={WhatsappIcon} width="40" height="40" alt="WhatSapp" />
																				</Link>
																			</div>
																			<div className="phone-call">
																				<Link href="tel:+91%2098180%2000526">
																					<Image src={PhoneCall} width="32" height="32" alt="Phone Call" />
																				</Link>
																			</div>

																		</div>

																	</div>
																</li>
																{
																	props?.data?.allCuisine?.nodes?.length > 0 && router?.query?.types!=='fun-zone' &&
																	<li className="cuisines-served-list border-bottom-0 pb-0">
																		<div className="cusisines-served-heading">
																			<h6>Cuisines Served</h6>
																		</div>
																		<ul className="list-inline mb-0">
																			{
																				props?.data?.allCuisine?.nodes?.map((item: _Object, i: number) => {
																					return (
																						<>
																							{
																								i <= 6 &&
																								<li className="list-inline-item" key={i}><span>{item?.name}</span></li>
																							}
																						</>
																					)
																				})
																			}
																		</ul>
																	</li>
																}
																{
																	props?.data?.activities?.nodes?.length > 0 && router?.query?.types ==='fun-zone' &&
																	<li className="cuisines-served-list border-bottom-0 pb-0">
																		<div className="cusisines-served-heading">
																			<h6>Activites</h6>
																		</div>
																		<ul className="list-inline mb-0">
																			{
																				props?.data?.activities?.nodes?.map((item: _Object, i: number) => {
																					return (
																						<>
																							{
																								i <= 6 &&
																								<li className="list-inline-item" key={i}><span>{item?.name}</span></li>
																							}
																						</>
																					)
																				})
																			}
																		</ul>
																	</li>
																}
															</ul>
														</div>
													</div >
												</div>
											</div>

											{
												props?.data?.extraOptions?.googleReviewsId?.length > 0 &&
												<div className="" onClick={(e) => handleClick2(e)}>
													<div className="card rounded-12">
														<div className="card-body p-0">

														</div>
													</div>
												</div>
											}
										</div>
									</div>
								</div>
							</div>
							<section className="nav-ban-tab-list">
								<div className={`col-12 px-0 sticky-header ${isSticky ? 'sticky' : ''}`}>
									<div className="page-container">
										<ul className="nav justify-between">
											{
												props?.data?.content?.length > 0 &&
												<li className="nav-item">
													<a href="#overview" className={`nav-link ${activeLink === 'overview' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'overview')}>
														Overview
													</a>
												</li>
											}

											{
												props?.data?.extraOptions?.packages?.length > 0 &&
												<li className="nav-item">
													<a href="#partyPackage" className={`nav-link ${activeLink === 'partyPackage' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'partyPackage')}>
														Party Packages
													</a>
												</li>
											}

											{
												props?.data?.extraOptions?.alaCarteMenu?.length > 0 &&
												<li className="nav-item">
													<a href="#menu" className={`nav-link ${activeLink === 'menu' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'menu')}>
														Menu
													</a>
												</li>
											}

											{
												props?.data?.amenities?.nodes?.length > 0 &&
												<li className="nav-item">
													<a href="#amenities" className={`nav-link ${activeLink === 'amenities' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'amenities')}>
														Amenities
													</a>
												</li>
											}

											<li className="nav-item">
												<a href="#location" className={`nav-link ${activeLink === 'location' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'location')}>
													Location
												</a>
											</li>

											{
												props?.data?.extraOptions?.propertyRules?.nodes?.length > 0 &&
												<li className="nav-item">
													<a href="#propertyRules" className={`nav-link ${activeLink === 'propertyRules' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'propertyRules')}>
														Property Rules
													</a>
												</li>
											}

											{
												props?.data?.extraOptions?.faqs?.length > 0 && props?.data?.extraOptions?.faqs[0]?.answer?.length > 0 &&
												<li className="nav-item">
													<a href="#faqs-data" className={`nav-link ${activeLink === 'faqs-data' ? 'active' : ''}`} onClick={(e) => handleClick(e, 'faqs-data')}>
														FAQ
													</a>
												</li>
											}

										</ul>
									</div>
								</div>
								<div className="page-container" onClick={(e) => handleClick2(e)}>
									<div className="row align-items-start">

										<div className="col-12">
											<div className={`tab-details ${activeLink === 'overview' ? 'active' : ''}`} id="overview">
												{props?.data?.content?.length > 0
													&&
													<>
														<div className="over-view-details">
															<div dangerouslySetInnerHTML={{ __html: props?.data?.content }} />
															<div className="over-view-hightlight" dangerouslySetInnerHTML={{ __html: props?.data?.extraOptions?.highlights }} />
															{/* <h6>Embark on a culinary journey to India at 34 Masala Lane, a pure vegetarian fine dining restaurant.</h6> */}
														</div>
													</>
												}

											</div>

											{props?.data?.extraOptions?.packages?.length > 0
												&&
												<div className={`tab-details ${activeLink === 'partyPackage' ? 'active' : ''}`} id="partyPackage">
													<>
														<h5 className="main-head">
															PARTY PACKAGES
														</h5>
														<div className="row">
															{props?.data?.extraOptions?.packages.map((item: _Object, i: number) => {
																return (
																	<>
																		{i <= loadMore &&
																			<div className="col-lg-6 col-md-6 col-sm-12 col-12" key={i}>
																				<div className="party-packages-card">
																					<div className="card">
																						<div className="card-body">
																							<div className="delux-party-content">
																								<h3>{item?.title}</h3>
																								{item?.shortDescription && <p>{item?.shortDescription}</p>}
																							</div>
																							<div className="free-cancecation-content">
																								{item?.freeCancellation === 'true' && <h6>Free Cancellation</h6>}
																								<ul className="list-inline">

																									{item?.minPax &&
																										<li className="list-inline-item"><p><span>Min.Pax</span>&nbsp;:&nbsp;{item?.minPax}</p></li>
																									}

																									{item?.validOn?.length > 0 &&
																										<>
																											<li className="list-inline-item">|</li>
																											<li className="list-inline-item"><p><span>Valid On</span>&nbsp;:&nbsp;{item?.validOn[0] || '-'}</p></li>
																										</>
																									}

																									{item?.timing?.length > 0 &&
																										<>
																											<li className="list-inline-item">|</li>
																											<li className="list-inline-item"><p><span>Timings</span>&nbsp;:&nbsp;{item?.timing[0]}</p></li>
																										</>
																									}

																								</ul>
																							</div>

																							<div className="party-packages-price">
																								<div className="d-flex align-items-center">
																									<h4>{item?.price && item?.salePrice && <span>₹{item?.price}</span>} {item?.price ? `₹${item?.salePrice ? item?.salePrice : item?.price} / Pax++` : '₹Free'}</h4>&nbsp;&nbsp;
																									{item?.price && item?.salePrice && <p>{calculateDiscountPercentage(item?.price, item?.salePrice)} %Off</p>}
																								</div>
																								<div className="party-packages-button-list">
																									<ul className="list-inline">
																										<li className="list-inline-item">
																											<span className="d-inline-block" tabIndex={0} data-bs-toggle="tooltip" title={item.content?.length > 0 ? '' : 'Menu not found'}>
																												<button type="button" disabled={!(item.content?.length > 0)} data-bs-toggle="modal" data-bs-target="#MenuDetailModal" className="btn btn-outline-primary" onClick={() => { setModelData({ menu: item.content, detail: item.menuDetail, tab: 'menu' }) }}>Menu</button>
																											</span>
																										</li>
																										<li className="list-inline-item">
																											<span className="d-inline-block" tabIndex={0} data-bs-toggle="tooltip" title={item.menuDetail?.length > 0 ? '' : 'Detail not found'}>
																												<button type="button" disabled={!(item.menuDetail?.length > 0)} data-bs-toggle="modal" data-bs-target="#MenuDetailModal" className="btn btn-outline-primary" onClick={() => { setModelData({ menu: item.content, detail: item.menuDetail, tab: 'detail' }) }}>
																													Details</button>
																											</span>

																										</li>
																										<li className="list-inline-item">
																											<Link href={`/booking/${router.query.slug}?locations=${query?.locations || ''}&date=${formik?.values?.date?.length > 0 ? formik?.values?.date : query?.date || ''}&types=${router?.query?.types || ''}&occasions=${router?.query?.occasions || ''}&amenities=${router?.query?.amenities || ''}&franchises=${router?.query?.franchises || ''}&cuisines=${router?.query?.cuisines || ''}&price_range=${router?.query?.price_range || ''}&pax=${router?.query?.pax || ''}&price=${item?.salePrice ? item?.salePrice : item?.price}&package=${item.title}`} className={`btn btn-danger text-white ${disable && 'disabled'}`}>Buy Now</Link>
																										</li>

																									</ul>
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		}
																	</>
																)
															})}
															{props?.data?.extraOptions?.packages?.length > 4 && props?.data?.extraOptions?.packages?.length != loadMore &&
																<div className="load-more-button">
																	<button type="button" className="btn btn-primary" onClick={() => { setLoadMore(props?.data?.extraOptions?.packages?.length) }}>Load More</button>
																</div>
															}
														</div>

													</>
												</div>
											}

											{
												props?.data?.extraOptions?.alaCarteMenu?.length > 0 &&
												<div className={`tab-details ${activeLink === 'menu' ? 'active' : ''}`} id="menu">
													<>

														<div className="la-carte-menu-list">
															<div className="row">
																<h3 className="main-head">
																	À LA CARTE MENU
																</h3>
																<div className="swiper-container position-relative">
																	<div className="swiper-arrows swiper-button-next"></div>
																	<div className="swiper-arrows swiper-button-prev"></div>
																	<Swiper
																		spaceBetween={32}
																		slidesPerView={1}
																		slidesPerGroup={4}
																		autoplay={true}
																		navigation={{
																			nextEl: '.swiper-button-next',
																			prevEl: '.swiper-button-prev'
																		}}
																		pagination={{ clickable: true }}
																		modules={[Navigation, Autoplay, Pagination]}
																		autoHeight={true}
																		breakpoints={{
																			375: {
																				slidesPerView: 1
																			},
																			550: {
																				slidesPerView: 2
																			},
																			992: {
																				slidesPerView: 3
																			},
																			1200: {
																				slidesPerView: 4
																			}
																		}}
																	>
																		{
																			props?.data?.extraOptions?.alaCarteMenu.map((item: _Object, i: number) => {
																				return (
																					<SwiperSlide key={i} className="venueDetailsMenu">
																						<a onClick={() => { setImages(item?.gallery?.length > 0 ? item?.gallery : [{ image: { node: { mediaItemUrl: placeholder } } }]) }} href="#" data-bs-toggle="modal" data-bs-target="#AlaCarteMenuModel">
																							<Image src={item?.gallery?.length > 0 && item.gallery[0]?.image?.node?.mediaItemUrl || placeholder} width={380} height={320} alt="Menu Images" />
																						</a>
																						<div className="menu-name">{item.title}</div>
																					</SwiperSlide>
																				)
																			})
																		}
																	</Swiper>
																</div>
															</div>
														</div>
													</>
												</div>
											}

											{props?.data?.amenities?.nodes?.length > 0 &&
												<div className={`tab-details ${activeLink === 'amenities' ? 'active' : ''}`} id="amenities">
													<>
														<h5 className="main-head">
															AMENITIES
														</h5>
														<ul className="nav">
															{props?.data?.amenities?.nodes?.map((item: _Object, i: number) => {
																return (
																	<li key={i} className="nav-item">

																		<Link href="#" className="nav-link d-flex">
																			<div className="flex-shrink-0">
																				<Image src={correctIcon} width="17" height="17" alt="icon" />
																			</div>
																			<div className="flex-grow-1 ms-1">
																				{item?.name}
																			</div>
																		</Link>
																	</li>
																)
															})}
														</ul>
													</>
												</div>
											}

											<div className={`tab-details ${activeLink === 'location' ? 'active' : ''}`} id="location">
												<div className="row">
													<div className="location-details">
														<h5 className="main-head">LOCATION</h5>
														<p>{props?.data?.extraOptions?.address?.address}</p>
													</div>

													{props?.data?.extraOptions?.address?.googleMap?.length > 0 &&
														<div className="col-lg-12">
															<p className="google-map" dangerouslySetInnerHTML={{ __html: props?.data?.extraOptions?.address?.googleMap }} />

															{/* <p>dangerouslySetInnerHTML={{ __html: props?.data?.extraOptions?.address?.googleMap }}</p> */}
														</div>
													}
												</div>
											</div>

											{props?.data?.extraOptions?.propertyRules?.nodes?.length > 0 &&
												<div className={`tab-details ${activeLink === 'propertyRules' ? 'active' : ''}`} id="propertyRules">
													<div className="property-rules-section">
														<div className="property-rules-row">
															<h2 className="main-head">
																PROPERTY RULES
															</h2>
															<div className="pets-policy-content">
																{
																	props?.data?.extraOptions?.propertyRules?.nodes.map((item: _Object, i: number) => {
																		return (
																			<div className="pets-policy-row" key={i}>
																				<p>{item?.title}</p>
																			</div>
																		)
																	})
																}
															</div>
														</div>
													</div>
												</div>
											}

											<div className={`tab-details ${activeLink === 'faqs-data' ? 'active' : ''}`} id="faqs-data">
												{props?.data?.extraOptions?.faqs?.length > 0 && props?.data?.extraOptions?.faqs[0]?.answer?.length > 0 && <FAQs data={props?.data?.extraOptions?.faqs} />}
											</div>

										</div>
									</div>
								</div>
							</section>

						</section>
						<section className="simlar-properties-tabs">
							{props?.data?.locations?.nodes[0]?.slug?.length > 0 && <SimilarProperty location={props?.data?.locations?.nodes[0]?.slug || ''} type={props?.data?.venueCategories?.nodes[0]?.slug || ''} />}
							<MenuDetail data={modelData} />
							<VenueImageSlider data={props?.data?.extraOptions?.mediaGallery?.imageGallery} />
							<AlaCarteMenu data={images} />
						</section>
					</Layout>
				</>
			)
			}
		</>
	)
}

export default VenueDetails