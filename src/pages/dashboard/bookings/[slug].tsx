/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { DashboardLayout, Loading, SEOHead } from '@/components';
import { _Object } from '@/utils/types';
import { bookingService } from '@/services/booking.service';
import { amountFormat, capitalize } from '@/utils/helpers';
import moment from 'moment';
import { useRouter } from 'next/router';
import { listService } from '@/services/venue.service';
import SelectField from '@/stories/form-inputs/select-field';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

// export const getStaticPaths: GetStaticPaths = async () => {
// 	const data: _Object = await bookingService.getAll(6)

// 	const paths = data?.entries?.map((item: _Object) => `/dashboard/bookings/${item.id}`) || [];

// 	return {
// 		paths,
// 		fallback: false
// 	}
// }

// export const getStaticProps: GetStaticProps = async ({ params }: _Object) => {
// 	const data = await bookingService.getDetials(params.slug)

// 	return {
// 		props: {
// 			data: data
// 		}
// 	}
// }

type RootState = {
	session: {
		loggedInUser: _Object;
	};
};

const BookingDetails = () => {
  const router: _Object = useRouter();

  // const [breakFast, setBreakFast] = useState<_Object>([]);
  // const [lunch, setLunch] = useState<_Object>([]);
  // const [hiTea, setHiTea] = useState<_Object>([]);
  // const [dinner, setDinner] = useState<_Object>([]);
  const [loading, setLoading] = useState(false)
  const [loadingMain, setLoadingMain] = useState(false)
  const [data, setData] = useState<_Object>({})
  const [venueDetails, setVenueDetails] = useState<_Object>({})
  const [userRole, setUserRole] = useState('');
  const { loggedInUser } = useSelector((state: RootState) => state.session);

  useEffect (()=>{
    const role = loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'administrator')
      ? 'administrator'
      : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'author')
        ? 'author'
        : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'user' || item.name==='subscriber') ? 'user': '';
    setUserRole(role)
  },[loggedInUser,userRole])
  const [modalShow, setModalShow] = useState({
    show: false,
    status: data['134'],
    finalStatus: data['134'],
    statusLabeltoShow: '',
    statusLabelButtonColor: ''
  });
  console.log(modalShow)

  const handleSelect = (itemId:number, status:string) => {
    bookingService.updateDetails(itemId,'134',status).then((data:_Object)=>setModalShow((prev)=>({...prev, finalStatus: data['134'], status:data['134']}))).then(()=>toast.success('Updated successfully'))
  };
  // const breakfastArray = [
  // 	'48', '105', '106', '107', '108', '49', '104', '52'
  // ];
  // const lunchArray = [
  // 	'55', '56', '73', '74', '57', '59', '60', '61', '62', '63',
  // 	'64', '65', '75', '66', '67', '68', '69', '76', '70', '71', '72'
  // ];
  // const hiTeaArray = ['78', '79', '80', '81', '81'];
  // const dinnerArray = [
  // 	'83', '84', '85', '86', '87', '88', '89', '90', '91', '92',
  // 	'93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103'
  // ];

  useEffect(()=>{
    if(modalShow.status == 'Confirmed'){
      setModalShow((prev)=>({...prev, statusLabeltoShow: 'Confirm', statusLabelButtonColor: 'green'}))
    }else if(modalShow.status == 'Declined'){
      setModalShow((prev)=>({...prev, statusLabeltoShow: 'Decline', statusLabelButtonColor: 'red'}))
    }
    else if(modalShow.status == 'Completed'){
      setModalShow((prev)=>({...prev, statusLabeltoShow: 'Complete', statusLabelButtonColor: 'green'}))
    }
    else if(modalShow.status == 'Cancelled'){
      setModalShow((prev)=>({...prev, statusLabeltoShow: 'Cancel', statusLabelButtonColor: 'red'}))
    }
    else if(modalShow.status == 'Request Received'){
      setModalShow((prev)=>({...prev, statusLabeltoShow: 'Waitlist', statusLabelButtonColor: '#cd9b10'}))
    }
  },[modalShow.status])

  useEffect(() => {
    setLoadingMain(true)
    bookingService.getDetials(router.query.slug).then((data: _Object) => {
      setData(data)
      setModalShow((prev)=>({...prev, status: data['134'], finalStatus: data['134']}))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // Object.entries(data).forEach(([key, value]: [string, any]) => {
      // 	if (breakfastArray.includes(key) && value?.length > 0) {
      // 		setBreakFast((prevState: string[]) => [...prevState, value]);
      // 	} else if (lunchArray.includes(key) && value?.length > 0) {
      // 		setLunch((prevState: string[]) => [...prevState, value]);
      // 	} else if (hiTeaArray.includes(key) && value?.length > 0) {
      // 		setHiTea((prevState: string[]) => [...prevState, value]);
      // 	} else if (dinnerArray.includes(key) && value?.length > 0) {
      // 		setDinner((prevState: string[]) => [...prevState, value]);
      // 	}
      // });
      listService.getVenueDetailsById(data['112']).then((data: _Object) => {
        setVenueDetails(data)
      })
      setLoadingMain(false)
    })
  }, []);

  const handleBack = () => {
    router.back();
  };

  const getVenueSlug = async (venueId: number) => {
    setLoading(true)
    const result = await listService.getVenueSlug(venueId)
    setLoading(false)

    router.push({
      pathname: `/venues/${result.slug}`
    });
  }

  const formatDate = (inputDate: string) => {
    const parsedDate = moment(inputDate, 'DD-MM-YYYY');

    const formattedDate = parsedDate.format('ddd, MMMM DD, YYYY');
    return formattedDate;
  }

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Booking details - Book My Party' } || ''} />

      <div className="booking-details">
        <h3>Booking details</h3>

        {loadingMain && <div className="d-flex justify-content-center align-items-center"><Loading /></div>}
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <div>
                  <h6 className="mb-1">Booking ID: {data.id}</h6>
                  <p className="mb-1"><span>{data['110'] ? formatDate(data['110']) : '-'}</span></p>
                  <span className={modalShow.finalStatus === 'Completed' || modalShow.finalStatus === 'Confirmed' ? 'approved' : (modalShow.finalStatus === 'Declined' || modalShow.finalStatus === 'Cancelled' ? 'declined' : 'waitlisted')}>{modalShow.finalStatus==='Request Received' && userRole !='author' ? 'Waitlisted' : modalShow.finalStatus}</span>
                </div>
                <SelectField
                  className="col-6 col-md-3"
                  placeholder={modalShow.finalStatus==='Request Received' && userRole !='author' ? 'Waitlisted' : modalShow.finalStatus}
                  options={(() => {
                    const options = userRole ==='author' ? [
                      // { label: 'Request Received'},
                      { label: 'Confirmed'},
                      { label: 'Declined'},
                      { label: 'Completed'}
                    ] : userRole === 'user' ? [{ label: 'Cancelled'}] : [];
                    return [...options];
                  })()}
                  onChange={(val: _Object) => {setModalShow((prev)=>({...prev, show: true, status: val.label}))
                    console.log(val)
                    // setSelectedDataToFilter((prevState) =>({...prevState, types: val.value?.split('+')})),setFilter(true),setList({ nodes: [] }),setCursor({endCursor: null,nextCursor: null})
                  }}
                  getOptionLabel={(option: { [key: string]: string }) => option && option.label}
                  getOptionValue={(option: { [key: string]: string }) => option && option.label}
                />
                <button onClick={() => handleBack()} className="btn btn-primary">
									Back
                </button>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="d-flex align-items-start gap-3">

                        {/* <span className="detail-icon">C</span> */}
                        <div>
                          <h5>Customer</h5>
                          <p className="mb-1">Name: <span>{`${data['28.3'] || ''}` + ' ' + `${data['28.6'] || ''}`}</span></p>
                          <p className="mb-1">Email: <span>{data['29']}</span></p>
                          <p className="mb-1">Phone: <span>{data['30']}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-12 col-lg-6">
										<div className="card">
											<div className="d-flex align-items-start gap-3">

												<div>
													<h5>Order Info</h5>
													<p className="mb-1">Shipping: <span>NA</span></p>
													<p className="mb-1">Payment method: <span>Cash on delivery</span></p>
													<p className="mb-1">Status: <span>NA</span></p>
												</div>
											</div>
										</div>
									</div> */}

                </div>

                <div className="table-responsive mt-4">
                  <table className="table table-bordered table-striped ">
                    <thead>
                      <tr><th>Venue Name</th>
                        <th>Venue Location</th>
                        {/* <th>Venue Amenities</th> */}
                        <th>Occation</th>
                        <th>Package</th>
                        <th>PAX</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="d-flex gap-2">
                          <button onClick={() => getVenueSlug(data['112'])} className="btn btn-link">{data['113']}</button>
                          {loading &&
														<div className="d-flex justify-content-center align-items-center">
														  <div className="spinner-border spinner-border-sm" role="status">
														    <span className="visually-hidden">Loading...</span>
														  </div>
														</div>
                          }
                        </td>
                        <td>{capitalize(data['109'])}</td>
                        {/* <td>Amenities</td> */}
                        <td>{capitalize(data['111'])}</td>
                        <td>{data['31']}</td>
                        <td>{data['33']}</td>
                        <td>{amountFormat(`${(data['32'] - data['116'] || '0')}`)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="row justify-content-end">
                  <div className="col">

                    {venueDetails?.venueCategories?.nodes?.length > 0 && (venueDetails?.venueCategories?.nodes[0]?.slug === 'banquet' || venueDetails?.venueCategories?.nodes[0]?.slug === 'farm-house') ?
                      <div className="card DayPart">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              {data['118'] && <th>Breakfast</th>}
                              {data['121'] && <th>Lunch</th>}
                              {data['120'] && <th>Hit-Tea</th>}
                              {data['119'] && <th>Dinner</th>}
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              {data['118'] &&
																<td>
																  <div dangerouslySetInnerHTML={{ __html: data['118'].replace(/\n/g, '<br />') }} />

																  {/* <ul className="list-unstyled">
																{breakFast?.length > 0 ?
																	breakFast?.map((item: string, i: number) => {
																		return (
																			<li key={i}>{item}{i !== breakFast.length - 1 ? ',' : ''}</li>
																		)
																	})
																	:
																	<li>-</li>
																}
															</ul> */}
																</td>
                              }

                              {data['121'] &&
																<td>
																  <div dangerouslySetInnerHTML={{ __html: data['121'].replace(/\n/g, '<br />') }} />

																  {/* <ul className="list-unstyled">
																{lunch?.length > 0 ?
																	lunch?.map((item: string, i: number) => {
																		return (
																			<li key={i}>{item}{i !== lunch.length - 1 ? ',' : ''}</li>
																		)
																	})
																	:
																	<li>-</li>
																}
															</ul> */}
																</td>
                              }

                              {data['120'] &&
																<td>
																  <div dangerouslySetInnerHTML={{ __html: data['120'].replace(/\n/g, '<br />') }} />

																  {/* <ul className="list-unstyled">
																{hiTea?.length > 0 ?
																	hiTea?.map((item: string, i: number) => {
																		return (
																			<li key={i}>{item}{i !== hiTea.length - 1 ? ',' : ''}</li>
																		)
																	})
																	:
																	<li>-</li>
																}
															</ul> */}
																</td>
                              }

                              {data['119'] &&
																<td>
																  <div dangerouslySetInnerHTML={{ __html: data['119'].replace(/\n/g, '<br />') }} />

																  {/* <ul className="list-unstyled">
																{dinner?.length > 0 ?
																	dinner?.map((item: string, i: number) => {
																		return (
																			<li key={i}>{item}{i !== dinner.length - 1 ? ',' : ''}</li>
																		)
																	})
																	:
																	<li>-</li>
																}
															</ul> */}
																</td>
                              }
                            </tr>
                          </tbody>
                        </table>

                      </div>
                      :
                      <>{venueDetails?.extraOptions?.packages?.find((itemData: _Object) => itemData?.title === data['31'])?.shortDescription &&
                        <div className="card">
                          <p>{venueDetails?.extraOptions?.packages?.find((itemData: _Object) => itemData?.title === data['31'])?.shortDescription}</p>
                        </div>}
                      {venueDetails?.extraOptions?.packages?.find((itemData: _Object) => itemData?.title === data['31'])?.content &&
                      <div className="card venueMenu" dangerouslySetInnerHTML={{ __html: venueDetails?.extraOptions?.packages?.find((itemData: _Object) => itemData?.title === data['31'])?.content}}/>
                      }</>
                    }
                    {
                      data['42']?.length > 0 &&
											<div className="note-order">
											  <h6>Special Request</h6>
											  <p className="mb-0">{data['42']}</p>
											</div>
                    }
                  </div>

                  <div className="col-12 col-md-12 col-lg-5 col-xxl-5">
                    <div className="card items-wrap">
                      <div className="order-item d-flex justify-content-between"><span>Product Total</span> {amountFormat(`${(data['32'] - data['116']) || '0'}`)}</div>
                      {/* <div className="d-flex justify-content-between"><span>Shiping To	</span> Shiping</div> */}

                      {/* <hr /> */}

                      {/* <div className="order-item d-flex justify-content-between"><span>Shiping Costs	</span> Costs</div> */}
                      {/* <div className="order-item d-flex justify-content-between"><span>Total without VAT</span> VAT</div> */}
                      {/* <div className="order-item d-flex justify-content-between"><span>Including 10% VAT</span> VAT</div> */}
                      <div className="order-item d-flex justify-content-between"><span>Total Tax 5%</span>{amountFormat(data['116'] || '0')}</div>
                      {/* <div className="d-flex justify-content-between"><span>Discount Code</span> -100₹</div> */}

                      <hr />

                      {/* <div className="d-flex justify-content-between mb-3"><span>Payment Method</span> VISA</div> */}
                      <div className="d-flex justify-content-between pt-4"><strong>Order Total</strong> <strong>{amountFormat(data['32'] || '0')}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={modalShow.show} onHide={() => setModalShow((prev)=>({...prev, show: false}))} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
          Update Booking Status
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row style={{padding: '0 10px'}}>
                Are you sure you want to {modalShow.statusLabeltoShow} the booking?
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setModalShow((prev)=>({...prev, show: false}))}>Cancel</Button>
            <Button onClick={() => {setModalShow((prev)=>({...prev, show: false})), handleSelect(data.id, modalShow.status)}} style={{backgroundColor: modalShow.statusLabelButtonColor, border: 'none'}}>{modalShow.statusLabeltoShow}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default BookingDetails