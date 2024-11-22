import React, { useEffect, useState } from 'react'
import { RootState, _Object } from '@/utils/types'
import Image from 'next/image'
import { RedHeart, location, placeholder, wishlistWhite } from '@/assets/images'
import Link from 'next/link'
import { AppDispatch } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { listService } from '@/services/venue.service'
import { getUserWishlist } from '@/redux/slices/session.slice'
import { useRouter } from 'next/router';

const TopPartyPlaces = ({ props }: _Object) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  useEffect(() => {
    if (router.asPath.includes('#')) {
      const id = router.asPath.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [router.asPath]);
  const [index, setIndex] = useState(0)
  const [like, setLike] = useState({
    loading: false,
    index: 0
  })
  const { userWishlist, isUserLoggedIn } = useSelector((state: RootState) => state.session);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${month}-${day}-${year}`;

  const handleClick = (index: number) => {
    setIndex(index)
  }

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
      const modelId = document.getElementById('login-model-id')
      if (modelId) {
        modelId.click()
      }
    }
  }

  return (
    <section className="party-places bg-light" id="party-places">
      <div className="container">
        <div className="row">
          <div className="col">
            <h2 style={{fontWeight:'500'}} className="main-head">
							Top Party Places
            </h2>
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              {props?.places?.map((item: _Object, i: number) => {
                return (
                  <li key={i} className="nav-item" role="presentation">
                    <button className={`nav-link ${i === index ? 'active' : ''}`} id="pills-city-one-tab" data-bs-toggle="pill" data-bs-target="#pills-city-one" type="button" role="tab" aria-controls="pills-city-one" aria-selected="true" onClick={() => handleClick(i)}>{item.location?.nodes[0].name}</button>
                  </li>
                )
              })}

            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div className="tab-pane fade show active" id="pills-city-one" role="tabpanel" aria-labelledby="pills-city-one-tab" tabIndex={0}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                  {props?.places[index].venues?.nodes?.length > 0 ?
                    props?.places[index].venues?.nodes?.map((item: _Object, i: number) => {
                      return (
                        <div key={i} className="col">
                          <div className="card">
                            <div className="row g-0">

                              <div className="col-lg-6 col-md-12">
                                <div className="image-wrapper">
                                  <Link href={`/venues/${item.slug}?locations=${props?.places[index].location.nodes[0].slug}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior>
                                    <a target="_blank" rel="noopener noreferrer">
                                      <Image src={item?.featuredImage?.node ? item?.featuredImage?.node?.mediaItemUrl : placeholder} width="200" height="100" alt="feture-img" />
                                    </a></Link>
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
                              </div>
                              <div className="col-lg-6 col-md-12">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <Link href={`/venues/${item.slug}?locations=${props?.places[index].location.nodes[0].slug}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior>
                                      <a target="_blank" rel="noopener noreferrer">{item.title}
                                      </a></Link>
                                  </h5>
                                  <p className="card-text m-0">
                                    {item?.extraOptions?.address?.address?.length && <Image src={location} width="15" height="15" alt="Location" />}
                                    <span>	{item?.extraOptions?.address?.address?.length > 0 ? item?.extraOptions?.address?.address : ''}</span>
                                  </p>
                                  <h5 className="price">
																		₹{' '}{item?.extraOptions?.paxPrice ? item?.extraOptions?.paxPrice : ''}
                                  </h5>
                                  <Link href={`/venues/${item.slug}?locations=${props?.places[index].location.nodes[0].slug}&date=${formattedDate}&types=restaurant&occasions=get-together&pax=${1}`} target="_blank" passHref legacyBehavior className="btn btn-primary w-100">
                                    <a className="btn btn-primary w-100" rel="noopener noreferrer" target="_blank">View Venue</a>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                    :
                    <div className="no-record"><h3>Coming Soon</h3></div>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default TopPartyPlaces

