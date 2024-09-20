/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import store from 'store'
import Image from 'next/image';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { _Object } from '@/utils/types'
// import Image from 'next/image'
// import { mailBox } from '@/assets/images'
import BackToTopButton from '../back-to-top'
import { Button, CheckBox, InputField } from '@/stories/form-inputs'
import { toast } from 'react-toastify';
import { menuService } from '@/services/menu.service';
import { CorporateGiftColored, FooterLogo, WhatsappIcon, offers, partyImgs } from '@/assets/images'
import ComingSoon from '../modals/coming-soon';
import VenueModal from '../modals/venue-modal';
import EventModal from '../modals/event-modal';
import { useRouter } from 'next/router';

const Footer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false)
	const [loadingFooter, setLoadingFooter] = useState<boolean>(false)

	const [isClient, setIsClient] = useState(false);

	const [pageProps, setPageProps] = useState<_Object>({
		footer: {
			menus: []
		}
	});

	const handleNavigation = (id: string) => {
		// Navigate to home page with the section id hash
		router.push(`/#${id}`);
	};

	// Initialize an array of false values, one for each menu item.
	const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});

	// Function to toggle visibility for a specific column based on label
	const toggleShowAll = (label: string) => {
		setShowAll((prevShowAll) => ({
			...prevShowAll,
			[label]: !prevShowAll[label]
		}));
	};

	useEffect(() => {
		setIsClient(true);

		async function fetchData() {
			try {
				if (store.get(`${process.env.NEXT_PUBLIC_FOOTER_DATA || 'footerMenu'}`) === undefined) {
					setLoadingFooter(true)
					const footer1 = await menuService.getNavigation('FOOTER1');
					const footer2 = await menuService.getNavigation('FOOTER2');

					setPageProps((prevPageProps: _Object) => ({
						...prevPageProps,
						footer: {
							menus: [
								...prevPageProps.footer.menus,
								...(footer1 ? [footer1] : []),
								...(footer2 ? [footer2] : [])
							]
						}
					}));

					store.set(`${process.env.NEXT_PUBLIC_FOOTER_DATA || 'footerMenu'}`, {
						footer: {
							menus: [
								...(footer1 ? [footer1] : []),
								...(footer2 ? [footer2] : [])
							]
						}
					})
					setLoadingFooter(false)
				} else {
					setPageProps(store.get(`${process.env.NEXT_PUBLIC_FOOTER_DATA || 'footerMenu'}`))
				}
			} catch (error) {
				console.error('Error fetching menu data:', error);
			}
		}

		fetchData();
	}, []);

	const formik = useFormik({
		initialValues: {
			input_1: '',
			input_3: '',
			permission: ''
		},

		enableReinitialize: true,

		validationSchema: yup.object().shape({
			input_1: yup.string().label('Email').required('Email is required').email(),
			input_3: yup.string().label('Whatsapp number').required('Whatsapp number is required').min(10, 'Whatsapp number must be at least 10 digits'),
			permission: yup.boolean().test({
				name: 'required-if-true',
				exclusive: true,
				message: 'Please agree to receive communication from Bookmyparty.',
				test: function (value) {
					const { permission } = this.parent;
					if (permission === true) {
						return true;
					} else {
						return !!value;
					}
				}
			})
		}),

		onSubmit: async (values) => {
			setLoading(true)
			const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
			const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/1/submissions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			});

			const result = await response.json()

			if (result.is_valid) {
				setLoading(false)
				toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
				formik.resetForm();
			} else {
				setLoading(false)
			}
		}
	})

	return (
		<>
			{isClient &&
				<footer>
					<div className="keep-in-touch">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-4 col-md-12">
									<div className="keep-in-touch-content">
										<p>NEWSLETTER</p>
										<h2 className="main-head">
											Keep In Touch
										</h2>
									</div>
								</div>
								<div className="col-lg-8 col-md-12">

									<form className="row align-items-center" onSubmit={formik.handleSubmit}>
										<InputField
											type="email"
											className="col-12 col-md-5"
											placeholder="Email"
											name="input_1"
											required={true}
											value={formik.values.input_1}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											error={formik.touched.input_1 && formik.errors.input_1}
										/>
										<InputField
											className="col-12 col-md-5"
											placeholder="WhatsApp Number"
											name="input_3"
											required={true}
											type="number"
											pattern="[0-9]{10}"
											maxLength={10}
											value={formik.values.input_3}
											onChange={(e) => {
												const inputValue = e.target.value.replace(/\D/g, '');
												if (inputValue.length <= 10) {
													formik.handleChange(e);
												}
											}}
											error={formik.touched.input_3 && formik.errors.input_3}
										/>

										<div className="col-lg-2 col-md-12">
											<Button label="Subscribe" type="submit" loading={loading} className="white" />
										</div>
									</form>
								</div>
								<div className="col-12 please-provide-footer">
									<div className="row justify-content-lg-start">

										<div className="col-xl-6 col-lg-6 col-md-12 my-auto">
											<p className="main-description">
												Please Provide Your Email & Whatsapp Number To Keep You Updated With Latest Information.
											</p>
										</div>
										<div className="col-xl-6 col-lg-6 col-md-12">
											<CheckBox
												name="permission"
												values={[formik.values?.permission]}
												options={[{ label: 'I agree to receive all communication from Bookmyparty.', value: 'true' }]}
												error={formik.touched?.permission && formik.errors?.permission}
												onChange={(e) => { formik.setFieldValue('permission', formik.values?.permission === 'true' ? 'false' : e.target.value) }}
											/>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>

					{
						loadingFooter ?
							<footer className="main-footer">
								<div className="page-container">

									<div className="row">
										<div className="col-lg-3 col-7 mb-3 mb-md-4">
											<span className="placeholder col-8 placeholder-h-20 mb-4"></span>

											<div>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
											</div>
										</div>

										<div className="col-lg-3 col-7 mb-3 mb-md-4">
											<span className="placeholder col-8 placeholder-h-20 mb-4"></span>

											<div>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
											</div>
										</div>

										<div className="col-lg-3 col-7 mb-3 mb-md-4">
											<span className="placeholder col-8 placeholder-h-20 mb-4"></span>

											<div>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
											</div>
										</div>

										<div className="col-lg-3 col-7 mb-3 mb-md-4">
											<span className="placeholder col-8 placeholder-h-20 mb-4"></span>

											<div>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
												<span className="placeholder col-7 mb-3"></span>
											</div>
										</div>
									</div>

								</div>
							</footer>
							:
							<div className="main-footer">

								<div className="page-container">

									<div className="footer-logo">
										<div className="row footer-logo-row">
											<div className="col-11">
												<Link href="/">
													<Image src={FooterLogo} width="283" height="70" alt="Footer Logo" className="img-fluid" />
												</Link>
											</div>
										</div>
									</div>
									<div className="row">
										{console.log(pageProps?.footer?.menus)
										}
										{pageProps?.footer?.menus?.length > 0 &&
											pageProps?.footer?.menus[0]?.map((item: _Object, i: number) => {
												// Get the current toggle state for this item based on its label
												const isExpanded = showAll[item.label] || false;

												return (
													item?.childItems?.nodes?.length > 0 && item.parentId === null &&
													<div key={i} className="col-12 col-sm-6 col-md-6 col-lg-3">
														<div className="pl-20">
															<h5>{item.label}</h5>
															<ul className="nav flex-column">
																{item?.childItems?.nodes?.slice(0, isExpanded ? item?.childItems?.nodes?.length : 4).map((child: _Object, index: number) => {
																	return (
																		<li key={index} className="nav-item">
																			{
																				child.label === 'List your Restaurant' || child.label === 'List your Banquet' || child.label === 'List your Catering Services' ?
																					(<>
																						<button type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#venueModal">
																							{child.label}
																						</button>
																					</>
																					) :
																					(
																						<>
																							{child.path === '/' || child.path === '#' ? (
																								<span className="nav-link">{child.label}</span>
																							) : (
																								<Link href={child.path} className="nav-link">
																									{child.label}
																								</Link>
																							)}
																						</>
																					)
																			}
																		</li>
																	)
																})
																}
															</ul>
															{/* View More/ Less Button */}
															{item?.childItems?.nodes?.length > 4 && (
																<span style={{ color: '#ffffff', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit' }} onClick={() => toggleShowAll(item.label)} className="unclickable-nav-link">
																	{isExpanded ? 'View Less' : 'View More'}
																</span>
															)}
														</div>
													</div>
												)
											})
										}

									</div>

									<hr />
									{/* Second section of Footer */}

									<div className="row">
										{pageProps?.footer?.menus?.length > 0 &&
											pageProps?.footer?.menus[1]?.map((item: _Object, i: number) => {
												// Get the current toggle state for this item based on its label
												const isExpanded = showAll[item.label] || false;
												return (
													item?.childItems?.nodes?.length > 0 && item.parentId === null &&
													<div key={i} className="col-12 col-sm-6 col-md-6 col-lg-3">
														<div className="pl-20">
															<h5>{item.label}</h5>
															<ul className="nav flex-column">
																{item?.childItems?.nodes?.slice(0, isExpanded ? item?.childItems?.nodes?.length : 4).map((child: _Object, index: number) => {
																	return (
																		<li key={index} className="nav-item">
																			{child.label === 'Party@home' || child.label === 'Trending Party Places' || child.label === 'Service Providers' ?
																				(
																					<>
																						<button type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#comingSoonModal">
																							{child.label}
																						</button>
																						<ComingSoon />
																					</>
																				) : (
																					<>
																						{child.path === '/' || child.path === '#' ? (
																							<span className="nav-link">{child.label}</span>
																						) : (
																							<Link href={child.path} className="nav-link">{child.label}</Link>
																						)}
																					</>
																				)}
																		</li>
																	)
																})
																}
																{/* View More/ Less Button */}
																{item?.childItems?.nodes?.length > 4 && (
																	<span style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600', fontFamily: 'Outfit' }} onClick={() => toggleShowAll(item.label)} className="unclickable-nav-link">
																		{isExpanded ? 'View Less' : 'View More'}
																	</span>
																)}
															</ul>
														</div>
													</div>
												)
											})
										}
									</div>

									<div className="copyright-wrapper text-center">
										<div className="col-12 mb-3">
											{/* <p className="mb-0">
												&copy;2024 Book My Party. All rights reserved.
												<Link href="mailto:info@bookmyparty.co.in" className="ps-3">
											<Image src={mailBox} width="18" height="18" alt="mailBox" className="img-fluid" />
											info@bookmyparty.co.in
										</Link>
											</p> */}
										</div>

										<div className="vcard col-12">
											<span className="fn n">
												<span className="given-name"></span>
												<span className="additional-name"></span>
												<span className="family-name"></span>
											</span>
											<h6 className="org">Book My Party</h6>
											<ul className="list-inline mt-4">
												<li className="list-inline-item">
													<a className="email" href="mailto:info@bookmyparty.co.in">info@bookmyparty.co.in</a>
												</li>
												<li className="list-inline-item"><a href="#">&nbsp; &nbsp; | &nbsp;&nbsp;</a> </li>
												<li className="list-inline-item"><a href="#"> +91 9911 412 626</a></li>

											</ul>
											{/* <div className="adr">
												<div className="street-address"><a href=""></a></div>
												<span className="locality">Noida</span>
												,&nbsp;
												<span className="region">Uttar Pradesh</span>
												,&nbsp;
												<span className="postal-code">201301</span>&nbsp;

												<span className="country-name">India</span>
											</div>
											<div className="tel">09911412626</div> */}
										</div>
									</div>
									<div className="d-none d-md-block whatsapp">
										<Link href="https://api.whatsapp.com/send/?phone=%2B919911412626&text&type=phone_number&app_absent=0" target="_self">
											<Image src={WhatsappIcon} width="40" height="40" alt="Phone" />
										</Link>
									</div>

									{/* <button type="button" className="d-none d-md-block btn phone border-0 p-0" data-bs-toggle="modal" data-bs-target="#EnquiryNowModal">
										<Image src={MassesIcon} width="40" height="40" alt="Masses Icon" />
									</button> */}
								</div>
							</div>

					}

					<div className="copy-right-area-bottam text-center">
						<div className="page-container">
							<div className="col-12">
								<p className="mb-0">
									&copy;2024 Book My Party. All rights reserved.
								</p>
							</div>
						</div>
					</div>
					<div className="d-md-none w-full mobFooter text-center">
						<ul className="d-flex">
							{/* <li><Link href="https://mockup4clients.com/cake"><Image src={CakeColored} width="40" height="40" alt="Phone" className="shake-icon" /></Link><Link href="https://mockup4clients.com/cake">Cake</Link></li> */}

							<li style={{ fontSize: '12px' }} onClick={() => handleNavigation('party-places')}><Image src={partyImgs} width="40" height="40" alt="Phone" />Top Party Places</li>
							<li style={{ fontSize: '12px' }} onClick={() => handleNavigation('partners-offers')}><Image src={offers} width="80" height="80" alt="Phone" />Offers</li>
							<li style={{ fontSize: '12px' }}><Link href="/Coming-soon"><Image src={CorporateGiftColored} width="40" height="40" alt="Phone" className="" /></Link><Link href="/Coming-soon">Corporate Gifting</Link></li>
							<li style={{ fontSize: '12px' }}><Link href="https://api.whatsapp.com/send/?phone=%2B919911412626&text&type=phone_number&app_absent=0" target="_self"><Image src={WhatsappIcon} width="40" height="40" alt="Phone" /></Link><Link href="https://api.whatsapp.com/send/?phone=%2B919911412626&text&type=phone_number&app_absent=0" target="_self">WhatsApp</Link></li>

							{/* <li><button type="button" data-bs-toggle="modal" data-bs-target="#EnquiryNowModal" style={{height: '20px', marginBottom:'3px'}}><Image src={MassesIcon} width="40" height="40" alt="Masses Icon" /></button><button type="button" data-bs-toggle="modal" data-bs-target="#EnquiryNowModal">Chat</button></li> */}

						</ul>
					</div>
					<BackToTopButton />
					<VenueModal />
					<EventModal />

				</footer>
			}
		</>
	)
}

export default Footer
