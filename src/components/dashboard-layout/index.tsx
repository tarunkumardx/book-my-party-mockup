/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dotsbutton, EditUser, WishList, bookingHistory, dashboard, logo, setting, user, userAvtar, venue} from '@/assets/images';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { _Object } from '@/utils/types';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { destroyAuthSession, getUserWishlist, setLoggedInUser } from '@/redux/slices/session.slice';
import store from 'store';
import moment from 'moment';

type DashboardLayoutProps = {
	children: React.ReactNode
}
type RootState = {
	session: {
		loggedInUser: _Object;
	};
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router: _Object = useRouter();

  const { loggedInUser } = useSelector((state: RootState) => state.session);
  const [avatar, setAvatar] = useState(userAvtar);
  const dispatch = useDispatch<AppDispatch>()
  const [show, setShow] = useState(false)

  const reloadPage = () => {
    router.reload(); // Reload the page
  };

  useEffect(() => {
    const token = store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`)
    if (token?.length > 0) {
      dispatch(setLoggedInUser())
      dispatch(getUserWishlist())
    } else {
      router.push('/')
    }
  }, [])

  useEffect(()=>{
    if(loggedInUser?.extraOptionsUser?.avatar)
      setAvatar(loggedInUser?.extraOptionsUser?.avatar)
  },[loggedInUser])

  const handleLogout = () => {
    dispatch(destroyAuthSession());
    router.push('/');
    reloadPage()
  };

  useEffect(() => {
    if (window.innerWidth > 449) {
      setShow(true)
    }
  }, [])

  const offcanvasFunction = () => {
    setShow(!show)
  }

  return (
    <>
      <section className="dashboard">

        <button className="btn sidebar-open-button" onClick={() => offcanvasFunction()} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <Image src={Dotsbutton} alt="Dotsbutton" width={10} height={20} />
        </button>

        <div className={`offcanvas offcanvas-start ${show ? 'show' : ''}`} data-bs-scroll="true" data-bs-backdrop="false" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">

          <div className="sidebar">

            <div className="offcanvas-header">
              <div className="main-logo">
                <Link href="/">
                  <Image src={logo} alt="logo" width={130} height={36} />
                </Link>
              </div>

              <button type="button" onClick={() => offcanvasFunction()} className="btn-close btn-close-white border-0 shadow-none offcanvas-close-button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            {/*
						<div className="main-logo">
							<Link href="/">
								<Image src={logo} alt="" width={130} height={36} />
							</Link>
						</div> */}

            {!loggedInUser?.registeredDate
              ?
              <p className="card-text placeholder-glow px-5">
                <span className="placeholder col-3 me-3 rounded-5 placehoder-img"></span>
                <span className="placeholder col-7"></span>
              </p>
              :
              <div className="sidebar-user">
                <div className="user-image">
                  <Image src={avatar} width="50" height="50" alt="" />
                </div>
                <div className="user-details">
                  {loggedInUser?.firstName && (
                    <span className="user-name">
                      {loggedInUser?.firstName + ' ' + (loggedInUser?.lastName?.length > 0 ? loggedInUser?.lastName : '')}
                    </span>
                  )}
                  <span className="user-role">Since: {moment(loggedInUser?.registeredDate).format('MMM YYYY')}</span>
                </div>
              </div>
            }
            <div className="sidebar-menu">
              <ul className="list-unstyled">
                {loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'author' || item.name == 'administrator')) &&
									<li>
									  <Link href="/dashboard" className={`btn ${router?.pathname?.split('/')?.length === 2 ? 'active' : ''}`}>
									    <Image src={dashboard} width={20} height={20} alt="" />
											Dashboard
									  </Link>
									</li>
                }

                <li>
                  <Link href="/dashboard/bookings" className={`btn ${router?.pathname?.split('/')[2] === 'bookings' ? 'active' : ''}`}>
                    <Image src={bookingHistory} width={20} height={20} alt="" />
										Bookings
                  </Link>
                </li>

                {loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'author' || item.name == 'administrator')) &&
									<li>
									  <Link href="/dashboard/venues" className={`btn ${router?.pathname?.split('/')[2] === 'venues' ? 'active' : ''}`} shallow={true}>
									    <Image src={venue} width={20} height={20} alt="" />
											My Venues
									  </Link>
									</li>
                }

                <li>
                  <Link href="/dashboard/profile" className={`btn ${router?.pathname?.split('/')[2] === 'profile' ? 'active' : ''}`}>
                    <Image src={user} width={20} height={20} alt="" />
										My profile
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/change-password" className={`btn ${router?.pathname?.split('/')[2] === 'change-password' ? 'active' : ''}`}>
                    <Image src={EditUser} width={20} height={20} alt="" />
										Change Password
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/wishlists" className={`btn ${router?.pathname?.split('/')[2] === 'wishlists' ? 'active' : ''}`}>
                    <Image src={WishList} width={20} height={20} alt="" />
										Wishlist
                  </Link>
                </li>
              </ul>
              {loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'administrator')) &&
              <ul className="list-unstyled" style={{borderTop: '1px solid #2c3d5b'}}>
                <li>
                  <Link href="/dashboard/all-bookings" className={`btn ${router?.pathname?.split('/')[2] === 'all-bookings' ? 'active' : ''}`}>
                    <Image src={bookingHistory} width={20} height={20} alt="" />
										All Bookings
                  </Link>
                </li>
                <li>
									  <Link href="/dashboard/all-venues" className={`btn ${router?.pathname?.split('/')[2] === 'all-venues' ? 'active' : ''}`}>
									    <Image src={venue} width={20} height={20} alt="" />
											All Venues
									  </Link>
                </li>
              </ul>
              }

            </div>

            <div className="sidebar-footer">
              <ul className="list-unstyled">
                <li>
                  <Link onClick={handleLogout} href="#" className="btn">
                    <Image src={setting} width={20} height={20} alt="Logout" />
										Logout
                  </Link>
                </li>

                <li className="">
                  <Link href="/" className="btn back-to-home">
										Back to Homepage
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="main-content">

          {children}
        </div>
        {/* <div className="phone">
					<Link href="tel:+91%2098180%2000526">
						<Image src={phone} width="24" height="24" alt="Phone" />
					</Link>
				</div>

				<div className="whatsapp">
					<Link href="https://api.whatsapp.com/send/?phone=%2B919818000526&text&type=phone_number&app_absent=0" target="_self">
						<Image src={whatsapp} width="24" height="24" alt="Phone" />
					</Link>
				</div> */}
      </section >
    </>
  )
}

export default DashboardLayout