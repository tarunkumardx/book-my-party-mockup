/* eslint-disable indent */
'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'

import { Logo } from '@/stories/pages'
import store from 'store';

import { _Object } from '@/utils/types'
import Link from 'next/link'
import { destroyAuthSession, getUserWishlist, setLoggedInUser } from '@/redux/slices/session.slice'
import Avatar from '../avatar'
import Image from 'next/image';
import { facebook, indiaFalg, instagram, youtube } from '@/assets/images';
import { LoginModal, SignUp } from '..';
import { useRouter } from 'next/router'
type RootState = {
  session: {
    isUserLoggedIn: boolean;
    loggedInUser: _Object;
  };
};

const Header = () => {
  const router = useRouter();
  const { isUserLoggedIn, loggedInUser } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch<AppDispatch>()

  const reloadPage = () => {
    router.reload(); // Reload the page
  };

  useEffect(() => {
    const token = store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`)
    if (token?.length > 0) {
      dispatch(setLoggedInUser())
      dispatch(getUserWishlist())
    }
  }, [])

  const handleLogout = () => {
    dispatch(destroyAuthSession());
    reloadPage()
  };

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <>
          <header>
            <div className="top-header">
              <div className="page-container">
                <div className="row">
                  <div className="col-5 col-md-4 my-auto">
                    <ul className="nav social-icons">
                      <li className="nav-item">
                        <Link href="https://www.facebook.com/bmpbookmyparty" className="nav-link" target="_blank">
                          <Image src={facebook} width="10" height="16" alt="Facebook" />
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="https://www.instagram.com/bookmypartyofficial/" className="nav-link" target="_blank">
                          <Image src={instagram} width="14" height="16" alt="Instagram" />
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link href="https://www.linkedin.com/company/bookmypartyofficial/?viewAsMember=true" className="nav-link" target="_blank">
                          <Image src={linkedin} width="14" height="16" alt="Linkedin" />
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link href="https://www.youtube.com/channel/UCxOwNpLSkvA584zVgASr5GQ" className="nav-link" target="_blank">
                          <Image src={youtube} width="18" height="16" alt="Youtube" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-7 col-md-8">
                    <ul className="list-inline mb-0 float-end modals-group">
                      {/* <li className="list-inline-item">
												<button type="button" className="btn btn-head" data-bs-toggle="modal" data-bs-target="#getQuotesModal">
													Get a Free Quote
												</button>

												<GetQuotesModal />
											</li> */}

                      <li className="list-inline-item">
                        <button type="button" className="btn btn-head" data-bs-toggle="modal" data-bs-target="#venueModal">
                          List Your Venue
                        </button>
                      </li>
                      <li className="list-inline-item d-md-inline-block img-flag">
                        <Image src={indiaFalg} alt="Flag" height={25} />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </header>
          <div className="main-header">
            <div className="page-container">
              <div className="row align-items-center justify-between">
                {/* Logo Section */}
                <div className="col-4 col-md-3">
                  <Logo />
                </div>

                {/* Right Side User/Account Section */}
                <div className="col-8 col-md-3">
                  <ul className="list-inline float-end mb-0 d-flex align-items-center">
                    {isUserLoggedIn ? (
                      <>
                        <li className="list-inline-item dropdown">
                          <button
                            className="btn dropdown-toggle avatar-btn"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <Avatar
                              data={`${loggedInUser?.firstName?.length > 0 ? loggedInUser?.firstName : loggedInUser?.name || ''} ${loggedInUser?.lastName?.length > 0 ? loggedInUser?.lastName : ''
                                }`}
                            />
                            <span className="user-name">{`${loggedInUser?.firstName || ''}`}</span>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            {loggedInUser?.roles?.nodes?.some((item: _Object) => item.name == 'author' || item.name == 'administrator') && (
                              <li className="me-0">
                                <a className="dropdown-item" href="/dashboard">
                                  Dashboard
                                </a>
                              </li>
                            )}
                            <li>
                              <a className="dropdown-item" href="/dashboard/bookings">
                                {loggedInUser?.roles?.nodes?.some((item: _Object) => item.name == 'author' || item.name == 'administrator')
                                  ? 'Booking History'
                                  : 'My Account'}
                              </a>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                              </button>
                            </li>
                          </ul>
                        </li>
                      </>
                    ) : (
                      <li className="list-inline-item">
                        <button
                          id="login-model-id"
                          type="button"
                          className="btn login-btn p-0"
                          data-bs-toggle="modal"
                          data-bs-target="#LoginModal"
                        >
                          Login
                        </button>
                      </li>
                    )}

                    <li className="list-inline-item me-0 me-md-3">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal">
                      {/* <Link href="/event" className="btn btn-primary"> */} {/* </Link> */}
                        Plan your event
                        </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <LoginModal />
            <SignUp />
          </div>
        </>
      )}
    </>
  )
}
export default Header