/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import { DashboardLayout, SEOHead } from '@/components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilSquare } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import Image from 'next/image';
import { RedHeart, placeholder, wishlistWhite } from '@/assets/images';
import { listService } from '@/services/venue.service';
import { RootState, _Object } from '@/utils/types';
import { Button } from '@/stories/form-inputs';
import { ElfsightWidget } from 'react-elfsight-widget';
import { truncateText } from '@/utils/helpers';
import { getUserWishlist } from '@/redux/slices/session.slice';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { toast } from 'react-toastify';
import { GetStaticProps } from 'next';
import SelectField from '@/stories/form-inputs/select-field';

export const getStaticProps: GetStaticProps = async () => {
  const locations = await listService.getLocations()
  const occasions = await listService.getOccasions()

  return {
    props: {
      locations: locations,
      occasions: occasions
    }
  }
}

const Venues = (props: _Object) => {
  const dispatch = useDispatch<AppDispatch>()
  const router: _Object = useRouter();
  const [like, setLike] = useState({
    loading: false,
    index: 0
  })
  const { userWishlist, isUserLoggedIn, loggedInUser } = useSelector((state: RootState) => state.session);
  const [list, setList] = useState<_Object>({ nodes: [] })
  const [venueRank, setVenueRank] = useState(null);
  const [selectedDataToFilter, setSelectedDataToFilter] = useState({
    locations: undefined,
    occasions:undefined,
    types: undefined
  });
  console.log(selectedDataToFilter)
  const [cursor, setCursor] = useState<_Object>({
    endCursor: null,
    nextCursor: null
  })
  console.log(cursor)
  const [filter, setFilter] = useState(false)
  const [modalShow, setModalShow] = useState({
    visible: false,
    venueId: null,
    venueName: ''
  });
  const [loading, setLoading] = useState<_Object>({
    loader: false,
    main: true,
    firstLoading: true
  })
  async function fetchData() {
    const newData = await listService.getVenues(10, cursor.endCursor, null,selectedDataToFilter);
    console.log(newData)
    if (filter) {
      setList({ nodes: newData.nodes, pageInfo: newData.pageInfo })
    } else {
      setList({ nodes: newData.nodes?.length > 0 ? [...list.nodes, ...newData.nodes] : [], pageInfo: newData.pageInfo })
    }

    setLoading({
      loader: false,
      main: false,
      firstLoading: false
    })
  }

  useEffect(() => {
    setLoading({ main: true })

    if (loggedInUser?.roles?.nodes && loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'administrator')) === false) {
      router.push('/');
    }

    if (loggedInUser?.roles?.nodes) {
      fetchData()
    }
  }, [cursor.endCursor, loggedInUser?.roles?.nodes, selectedDataToFilter])

  const loadMore = () => {
    setLoading({ loader: true })
    setFilter(false)
    setCursor({
      endCursor: list.pageInfo.endCursor
    })
  }

  const handleRangeChange = (event: _Object) => {
    setVenueRank(event.target.value);
  };

  const handleVenueListing = async(venueId: null | number, rankingPriority?: null | number, hide?: null | boolean) => {
    await listService.updateVenueListing(venueId,rankingPriority,hide).then(()=>{setFilter(true),setCursor({endCursor: null,nextCursor: null}),setList({nodes: []})}).then(()=>toast.success('Venue Listing Updated successfully')).then(()=>setLoading({ main: true }));
    const newData = await listService.getVenues(10, cursor.endCursor, null,selectedDataToFilter);
    setList({ nodes: newData.nodes, pageInfo: newData.pageInfo })

    setLoading({
      loader: false,
      main: false,
      firstLoading: false
    })
    setVenueRank(null)
  };

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
      window.alert('Please log in before adding to your wishlist.');
    }
  }

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Venues - Book My Party' } || ''} />

      <div className="my-venue">
        <div className="venue-header d-flex justify-content-between align-items-center">
          <h3 className="mb-3">All Venues</h3>
          <SelectField
            className="col-6 col-md-3"
            placeholder="Choose location"
            options={(() => {
              const locations = props?.locations || [];
              const options = locations
                .filter((item: _Object) => item?.slug !== 'india')
                .map((item: _Object) => ({ label: item?.name, value: item?.slug }));

              return [{ label: 'All', value: undefined }, ...options];
            })()}
            onChange={(val: _Object) => {
              setSelectedDataToFilter((prevState) =>({...prevState, locations: val.value?.split('+')})),setFilter(true),setList({ nodes: [] }),setCursor({endCursor: null,nextCursor: null})
            }}
            getOptionLabel={(option: { [key: string]: string }) => option && option.label}
            getOptionValue={(option: { [key: string]: string }) => option && option.value}
          />
          <SelectField
            className="col-6 col-md-3"
            placeholder="Choose Ocassion"
            options={(() => {
              const occasions = props?.occasions || [];
              const options = occasions
                .filter((item: _Object) => item?.slug !== 'india')
                .map((item: _Object) => ({ label: item?.name, value: item?.slug }));

              return [{ label: 'All', value: undefined }, ...options];
            })()}
            onChange={(val: _Object) => {
              setSelectedDataToFilter((prevState) =>({...prevState, occasions: val.value?.split('+')})),setFilter(true),setList({ nodes: [] }),setCursor({endCursor: null,nextCursor: null})
            }}
            getOptionLabel={(option: { [key: string]: string }) => option && option.label}
            getOptionValue={(option: { [key: string]: string }) => option && option.value}
          />
          <SelectField
            className="col-6 col-md-3"
            placeholder="Choose Venue Type"
            options={(() => {
              const options=[
                { label: 'Restaurant', value: 'restaurant'},
                { label: 'Banquet', value: 'banquet'},
                { label: 'Farm House', value: 'farm-house'},
                { label: 'Fun Zone', value: 'fun-zone'},
                { label: 'Caterers', value: 'caterers'}
              ]
              return [{ label: 'All', value: undefined }, ...options];
            })()}
            onChange={(val: _Object) => {
              setSelectedDataToFilter((prevState) =>({...prevState, types: val.value?.split('+')})),setFilter(true),setList({ nodes: [] }),setCursor({endCursor: null,nextCursor: null})
            }}
            getOptionLabel={(option: { [key: string]: string }) => option && option.label}
            getOptionValue={(option: { [key: string]: string }) => option && option.value}
          />
        </div>

        {/* <form onSubmit={formik.handleSubmit} className="row">
					<div className="col">
						<div className="d-flex align-items-center gap-3">
							<input
								className="search-box form-control"
								type="text"
								name="search"
								value={formik.values.search}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<Button type="submit" label="Search Venue" className={formik.values.search.length > 0 ? 'btn btn-primary' : 'btn btn-primary disabled'} />
						</div>
					</div>
				</form> */}

        {!loading.main && list?.nodes?.length === 0 &&
					<div className="d-flex justify-content-center align-items-center mt-5">
					  <div>
					    <h3>Venues Not Found</h3>
					  </div>
					</div>
        }

        {list?.nodes?.map((item: _Object, i: number) => {
          return (
            <>
              <div key={i} className="row venue-list" style={item.extraOptions.hide ? {opacity: '0.5'}: {}}>
                <div className="col-lg-3 col-md-3 col-sm-12 ps-0 venue-list-img-wrap">
                  <div className="thumb">
                    <div className="add-wishlist">
                      <button disabled={like.loading} onClick={() => addToWishlist(item.databaseId, i)} className="btn wishlist">
                        {like.loading && like.index === i ?
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          :
                          <Image src={userWishlist?.some((wishlist: _Object) => wishlist.id === `${item.databaseId}`) ? RedHeart : wishlistWhite} alt="" width="22" height="22" />
                        }
                      </button>
                    </div>
                    <Link href={`/venues/${item.slug}`}>
                      <Image src={item?.featuredImage?.node?.sourceUrl || placeholder} width={364} height={337} alt="" />
                    </Link>
                  </div>
                </div>

                <div className="col item-content items-p">
                  <p>{item.extraOptions.address.address}</p>

                  <h5><Link href={`/venues/${item.slug}`}>{item.title}</Link></h5>
                  {
                    item?.extraOptions?.googleReviewsId &&
									<div className="google-star-ratings">
									  <ElfsightWidget widgetId={item.extraOptions.googleReviewsId} />
									</div>
                  }

                  <div dangerouslySetInnerHTML={{ __html: truncateText(item.content || '') }} />
                  {item?.extraOptions?.holidays?.length > 0 && <span>Holidays: {item?.extraOptions?.holidays?.split(',')?.map((date: string) => moment(date).format('MMM DD, YYYY')).join(', ')}</span>}
                </div>

                <div className="col-lg-3 col-md-3 col-sm-12 casual-item items-p">
                  <div className="px-3">
                    {/* <p>Casual dining</p> */}
                    <span>Ranking Position: {item.extraOptions.rankingPriority}</span>
                    <Link href={`/venues/${item.slug}`} className="btn btn-primary">View Venue</Link>
                  </div>

                  <ul className="list-unstyled">
                    {/* <li className="d-flex faTimes">{deleteLoading?.id != item.id && <button className="bg-transparent border-0" onClick={() => deleteVenue(item?.id)}><FontAwesomeIcon icon={faTimes} /></button>}{deleteLoading.id === item.id && deleteLoading.loading && <span><Loading small={true} /></span>}</li> */}
                    {/* <li className="faCheckSquare"><Link href="#"><FontAwesomeIcon icon={faCheckSquare} /></Link></li> */}
                    <li className="faPencilSquare"><FontAwesomeIcon icon={faPencilSquare} onClick={() => setModalShow((prevState) => ({ ...prevState, visible: true, venueId: item.databaseId, venueName: item.title }))}/></li>
                    <li className="faEye"><FontAwesomeIcon icon={faEye} onClick={()=>handleVenueListing(item.databaseId, null, !item.extraOptions.hide)}/></li>
                  </ul>
                </div>
              </div>
            </>
          )
        })}

        {loading.main &&
					<div className="d-flex justify-content-center align-items-center mt-5">
					  <div className="spinner-border" role="status">
					    <span className="visually-hidden">Loading...</span>
					  </div>
					</div>
        }

        <div className="d-flex justify-content-center mt-3 mb-4">
          {list?.pageInfo?.hasNextPage && !loading.main &&
						<Button label="Load More" loading={loading.loader} onClick={loadMore} className="primary mx-auto" />
          }
        </div>
      </div>

      <Modal show={modalShow.visible} onHide={() => {setModalShow((prevState) => ({ ...prevState, visible: false })), setVenueRank(null)}} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          Set Ranking for the Venue Name :<br/> <b>{modalShow.venueName}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Form.Label>High the Ranking Number: Achieve the top position for the item</Form.Label>
            <Form.Range onChange={handleRangeChange}/>
            {venueRank}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button label="Set" onClick={() => {setModalShow((prevState) => ({ ...prevState, visible: false })), handleVenueListing(modalShow.venueId, venueRank)}}/>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}

export default Venues