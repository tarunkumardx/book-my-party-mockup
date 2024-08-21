/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import store from 'store';

import { DashboardLayout, Loading, SEOHead } from '@/components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Image from 'next/image';
import { LocationIcon, placeholder } from '@/assets/images';
import { listService } from '@/services/venue.service';
import { RootState, _Object } from '@/utils/types';
import { getUserWishlist } from '@/redux/slices/session.slice';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
// import { ElfsightWidget } from 'react-elfsight-widget';
import { truncateText } from '@/utils/helpers';

const Venues = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { userWishlist } = useSelector((state: RootState) => state.session);
  const [loading, setLoading] = useState(true)
  const [removeLoading, setRemoveLoading] = useState<_Object>({
    loading: false,
    id: ''
  })

  const RemoveWishlist = async (venueId: number) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this item?');

    if (isConfirmed) {
      setRemoveLoading({
        loading: true,
        id: venueId
      })
      const result = await listService.addToVenueWsihlist(venueId)

      if (result?.success) {
        dispatch(getUserWishlist())
        setRemoveLoading({
          loading: false,
          id: venueId
        })
      }
    } else (
      console.log('Deletion canceled')
    )
  }

  useEffect(() => {
    setLoading(true)
    const token = store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`)
    if (token?.length > 0) {
      dispatch(getUserWishlist())
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }, [])

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Wishlist - Book My Party' } || ''} />

      <div className="my-venue">
        <div className="venue-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Wishlist</h3>
          {/* <Link href="/dashboard/venues/create" className="btn btn-primary" onClick={() => localStorage.removeItem('adsf546a5sdf4')}>Add New Venue</Link> */}
        </div>

        {
          !loading && userWishlist.length === 0 &&
					<div className="d-flex justify-content-center align-items-center">
					  <h5 style={{ textTransform: 'none' }}>Empty wishlist</h5>
					</div>
        }

        {
          loading && userWishlist.length === 0 &&
					<div className="d-flex justify-content-center align-items-center">
					  <div className="spinner-border" role="status">
					    <span className="visually-hidden">Loading...</span>
					  </div>
					</div>
        }

        {userWishlist?.map((item: _Object, i: number) => {
          const cuisineData = JSON.parse(item.cuisine_list)

          return (
            <div key={i} className="row venue-list">
              <div className="col-lg-3 col-md-3 col-sm-12 ps-0 venue-list-img-wrap">
                <div className="thumb">
                  {/* <div className="add-wishlist">
										<button onClick={() => addToWishlist(item.databaseId)} className="btn wishlist">
											<Image src={userWishlist?.some((wishlist: _Object) => wishlist.id === `${item.databaseId}`) ? RedHeart : wishlistWhite} alt="" width="22" height="22" />
										</button>
									</div> */}
                  <Link href={`/venues/${item.slug}`}>
                    <Image src={item?.featured_image || placeholder} width={364} height={300} alt="" />
                  </Link>
                </div>
              </div>

              <div className="col item-content items-p">
                <h5><Link href={`/venues/${item.slug}`}>{<div dangerouslySetInnerHTML={{ __html: truncateText(item.title || '') }} />}</Link></h5>

                {item.address?.length > 0 &&
									<p><Image
									  src={LocationIcon}
									  width="18"
									  height="18"
									  alt=""
									/> {item.address}</p>
                }
                {/* {
									item?.google_reviews_id &&
									<span className="google-star-ratings">
										<ElfsightWidget widgetId={item.google_reviews_id} />
									</span>
								} */}

                <div dangerouslySetInnerHTML={{ __html: truncateText(item.description || '') }} />
                {cuisineData?.length > 0 && <p><b>Cuisine serve:</b> {cuisineData.map((item: string) => item).join(', ')}</p>}
              </div>

              <div className="col-lg-3 col-md-3 col-sm-12 casual-item items-p">
                <div className="px-3">
                  {item?.pax_price > 0 && <h4>₹{item.pax_price || 0} / Pax</h4>}

                  <Link href={`/venues/${item.slug}`} className="btn btn-primary">View Venue</Link>
                </div>

                <ul className="list-unstyled">
                  <li className="d-flex faTimes">{removeLoading?.id != item.id && <button className="bg-transparent border-0" onClick={() => RemoveWishlist(item?.id)}><FontAwesomeIcon icon={faTimes} /></button>}{removeLoading.id === item.id && removeLoading.loading && <span><Loading small={true} /></span>}</li>
                  {/* <li className="faCheckSquare"><Link href="#"><FontAwesomeIcon icon={faCheckSquare} /></Link></li> */}
                  {/* <li className="faPencilSquare"><Link href={`/dashboard/venues/${item.slug}`}><FontAwesomeIcon icon={faPencilSquare} /></Link></li> */}
                  {/* <li className="faEye"><Link href="#"><FontAwesomeIcon icon={faEye} /></Link></li> */}
                </ul>
              </div>
            </div>
          )
        })}

        {/* <div className="d-flex justify-content-center mt-3 mb-4">
					{list?.pageInfo?.hasNextPage && !loading.main &&
						<Button label="Load More" loading={loading.loader} onClick={loadMore} className="primary mx-auto" />
					}
				</div> */}
      </div>

    </DashboardLayout>
  )
}

export default Venues