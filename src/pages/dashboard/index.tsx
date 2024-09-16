/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { DashboardLayout, SEOHead } from '@/components';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { _Object } from '@/utils/types';
import { setLoggedInUser } from '@/redux/slices/session.slice';
import { bookingService } from '@/services/booking.service';
import { useRouter } from 'next/router';
import { listService } from '@/services/venue.service';
import { amountFormat, changeDateFormat, formatDate } from '@/utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type RootState = {
	session: {
		loggedInUser: _Object;
	};
};

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router: _Object = useRouter();

  const { loggedInUser } = useSelector((state: RootState) => state.session);
  const [list, setList] = useState<_Object>({})
  const [filterData, setFilterData] = useState<_Object>({
    page: 1,
    per_page: 5,
    user_id: loggedInUser?.databaseId
  })
  const [loading, setLoading] = useState(false)
  const [slugLoading, setSlugLoading] = useState({
    loading: false,
    index: 0
  })
  console.log(list?.entries?.length)
  const [userRole, setUserRole] = useState('');
  useEffect (()=>{
    const role = loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'administrator')
      ? 'administrator'
      : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'author')
        ? 'author'
        : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'subscriber' || item.name === 'customer') ? 'user': '';
    setUserRole(role)
  },[loggedInUser,userRole])

  function getClass(status: string): string {
    switch (status) {
    case 'Completed':
      return 'approved';
    case 'Confirmed':
      return 'approved';
    case 'Request Received':
      return 'waitlisted';
    case 'Request Waitlisted':
      return 'waitlisted';
    case 'Cancelled':
      return 'declined';
    case 'Declined':
      return 'declined';
    default:
      return 'black';
    }
  }

  useEffect(() => {
    dispatch(setLoggedInUser())
    if (loggedInUser?.roles?.nodes && loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'author' || item.name == 'administrator')) === false) {
    	router.push('/');
    }

    async function name() {
      setLoading(true)
      if (loggedInUser?.databaseId) {
        const venues = await listService.getVenuesIds(loggedInUser.databaseId)
        const venuesIds = venues.edges.map((item: _Object) => item.node.databaseId).join(',')
        console.log(userRole)
        const data = userRole!='' && await bookingService.getAll(14, { ...filterData, user_id: userRole != 'user' ? loggedInUser.email : loggedInUser.databaseId, venuesIds: venuesIds, userRoleEmail:loggedInUser.email }, userRole)
        if (data?.entries) {
          setList(data)
          console.log(data)
        } else {
          setList({ entries: [], total_count: 0 })
        }
        userRole!='' && setLoading(false)
      }
    }

    setFilterData((pre: _Object) => ({
      ...pre,
      user_id: loggedInUser?.databaseId
    }))

    name()
  }, [filterData.page, loggedInUser?.databaseId, userRole])

  const getVenueSlug = async (venueId: number, index: number) => {
    setSlugLoading({
      loading: true,
      index: index
    })
    const result = await listService.getVenueSlug(venueId)
    setSlugLoading({
      loading: false,
      index: index
    })

    router.push({
      pathname: `/venues/${result.slug}`
    });
  }

  return (
    <>
      <SEOHead seo={{ title: 'Dashboard - Book My Party' } || ''} />
      <DashboardLayout>
        <div className="dashboard-content">
          <h3>
						Dashboard
          </h3>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p>TOTAL REVENUE GENERATED</p>
                  <h2>{loggedInUser?.venuesStatistics ? amountFormat(JSON.parse(loggedInUser.venuesStatistics)?.total_income) : '0'}</h2>
                  {/* <h2>{amountFormat(totalIncome?.toString())}</h2> */}
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p>Number of bookings</p>
                  <h2>{loggedInUser?.venuesStatistics ? JSON.parse(loggedInUser.venuesStatistics)?.number_of_bookings : '0'}</h2>
                  {/* <h2>{totalBookings?.toString() || '0'}</h2> */}
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p>Number of venues</p>
                  <h2>{loggedInUser?.venuesStatistics ? JSON.parse(loggedInUser.venuesStatistics)?.number_of_venues : '0'}</h2>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p>BMP Shares</p>
                  <h2>{amountFormat((loggedInUser?.venuesStatistics ? JSON?.parse(loggedInUser.venuesStatistics)?.total_income*0.1 : 0*0.1)?.toString())}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-booking">
          <div className="justify-between">
            <h3 className="mb-0">
							Recent Bookings
            </h3>
            <Link className="btn btn-primary" href="/dashboard/bookings">View All</Link>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped ">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Booking Date</th>
                      <th>Party Date</th>
                      <th>Booking Status</th>
                      <th>Venue Name</th>
                      <th>Venue Location</th>
                      <th>Package</th>
                      <th>Pax</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      loading &&
											<tr>
											  <td colSpan={11}>
											    <div className="d-flex justify-content-center align-items-center">
											      <div className="spinner-border" role="status">
											        <span className="visually-hidden">Loading...</span>
											      </div>
											    </div>
											  </td>
											</tr>
                    }

                    {!loading && list?.entries?.length == 0 && (
                      <tr>
                        <td colSpan={11}>
                          <div className="d-flex justify-content-center align-items-center">
                            <div>
                              <h6 className="mb-0">Booking not found</h6>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!loading && list?.entries?.map((item: _Object, i: number) => {
                      return (
                        <tr key={i}>
                          <td>{`${item['28.3']}` + ' ' + `${item['28.6']}`}</td>
                          <td>
                            {changeDateFormat(item['date_created'].split(' ')[0],'dashboard')}
                          </td>
                          <td>
                            {formatDate(item['110'])}
                          </td>
                          <td className="status">
                            <span className={getClass(item['134'])}>{item['134'] ==='Request Received' && userRole != 'author' && userRole != 'administrator' ? 'Waitlisted': item['134']}</span>
                          </td>
                          <td className="d-flex gap-2">
                            <button onClick={() => getVenueSlug(item['112'], i)} className="btn btn-link">{item['113']}</button>
                            {(slugLoading.loading && slugLoading.index === i) &&
															<div className="d-flex justify-content-center align-items-center">
															  <div className="spinner-border spinner-border-sm" role="status">
															    <span className="visually-hidden">Loading...</span>
															  </div>
															</div>
                            }
                          </td>
                          <td>{item['124']}</td>
                          <td>{item['31']}</td>
                          <td>{item['33']}</td>
                          <td>
                            <Link href={`/dashboard/bookings/${item.id}`} className="btn btn-primary">
                              <FontAwesomeIcon icon={faInfoCircle} />

															Details
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </DashboardLayout>
    </>
  )
}

export default Dashboard