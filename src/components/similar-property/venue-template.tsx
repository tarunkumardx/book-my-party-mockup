import { RedHeart, location, placeholder, wishlistWhite } from '@/assets/images';
import { getUserWishlist } from '@/redux/slices/session.slice';
import { AppDispatch } from '@/redux/store';
import { listService } from '@/services/venue.service';
import { amountFormat } from '@/utils/helpers';
import { RootState, _Object } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
// import { ElfsightWidget } from 'react-elfsight-widget';
import { useDispatch, useSelector } from 'react-redux';

const VenueTemplate = ({ props, i }: _Object) => {
  const dispatch = useDispatch<AppDispatch>()

  const [like, setLike] = useState({
    loading: false,
    index: 0
  })
  const { userWishlist, isUserLoggedIn } = useSelector((state: RootState) => state.session);

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
    <div className="card">
      <div className="img-wrapper">
        <Link href={`/venues/${props.slug}`} className="">
          <Image src={props?.featuredImage?.node?.sourceUrl || placeholder} alt="" width="395" height="265" className="w-100" />
        </Link>
        <button disabled={like.loading} onClick={() => addToWishlist(props.databaseId, i)} className="btn wishlist">
          {like.loading && like.index === i ?
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            :
            <Image src={userWishlist?.some((wishlist: _Object) => wishlist.id === `${props.databaseId}`) ? RedHeart : wishlistWhite} alt="" width="22" height="22" />
          }
        </button>
      </div>
      <div className="card-body">
        <Link href={`/venues/${props.slug}`} className="">
          {/* <Image src={userAvtar} width="33" height="33" alt="" /> */}
        </Link>

        <h4 className="venue-name">
          <Link href={`/venues/${props.slug}`}>{props?.title || ''}</Link>
        </h4>

        <div className="d-flex address">
          <div className="flex-shrink-0">
            {props?.extraOptions?.address?.address?.length > 0 &&
							<Image src={location} width="14" height="14" alt="Location" />
            }
          </div>
          <div className="flex-grow-1 ms-2">
            <p>{props?.extraOptions?.address?.address || ''}</p>
          </div>
        </div>

        {/* {
					props?.extraOptions?.googleReviewsId &&
					<div className="google-star-ratings">
						<ElfsightWidget widgetId={props.extraOptions.googleReviewsId} />
					</div>
				} */}

        <div className={`footer d-flex justify-content-between ${props?.extraOptions?.paxPrice > 0 ? '' : 'venus-button-center'}`}>
          {props?.extraOptions?.paxPrice > 0 && <h6 className="my-auto">{amountFormat(`${props?.extraOptions?.paxPrice || 0}`)} / Pax</h6>}
          <Link href={`/venues/${props.slug}`} passHref legacyBehavior className="btn btn-primary">
            <a className="btn btn-primary" rel="noopener noreferrer">View Venue</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VenueTemplate