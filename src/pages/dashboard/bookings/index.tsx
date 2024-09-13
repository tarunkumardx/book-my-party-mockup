/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { DashboardLayout, Pagination, SEOHead } from '@/components';
import Link from 'next/link';
import { _Object } from '@/utils/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedInUser } from '@/redux/slices/session.slice';
import { AppDispatch } from '@/redux/store';
import { bookingService } from '@/services/booking.service';
import { listService } from '@/services/venue.service';
import { useRouter } from 'next/router';
import { changeDateFormat, formatDate } from '@/utils/helpers';
import Image from 'next/image';
import { CalendarView, ListView } from '@/assets/images';

type RootState = {
	session: {
		loggedInUser: _Object;
	};
};
interface ListEntry {
  id: number;
  [key: string | number]: string | number;
}

interface List {
  entries: ListEntry[];
  total_count: number;
}

const BookingHistory = () => {
  const router: _Object = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const [list, setList] = useState<List>({ entries: [], total_count: 0 });
  const [userRole, setUserRole] = useState('');
  useEffect (()=>{
    const role = loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'administrator')
      ? 'administrator'
      : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'author')
        ? 'author'
        : loggedInUser?.roles?.nodes?.some((item: { name: string }) => item.name === 'subscriber' || item.name === 'customer') ? 'user': '';
    setUserRole(role)
  },[loggedInUser,userRole])

  const [filterData, setFilterData] = useState<_Object>({
    page: 1,
    per_page: 10,
    user_id: loggedInUser?.databaseId
  })
  const [loading, setLoading] = useState(false)
  const [slugLoading, setSlugLoading] = useState({
    loading: false,
    index: 0
  })
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
    <DashboardLayout>
      <SEOHead seo={{ title: 'Bookings - Book My Party' } || ''} />

      <div className="booking">
        <h3>
					Bookings
        </h3>
        <div>
          <ul className="list-unstyled d-flex gap-3 align-left justify-content-end">
            <li><Link className="btn-primary" title="List View" href="/dashboard/bookings"><Image src={ListView} width={20} height={20} alt="" /></Link></li>
            <li><Link className="btn-primary" title="Calendar View" href="/dashboard/bookings/calendar"><Image src={CalendarView} width={20} height={20} alt="" /></Link></li>
          </ul>
        </div>
        <div className="card">
          <div className="card-body">

            <div className="tab-content" id="pills-tabContent">
              <div className="tab-pane fade show active overflow-x" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab" tabIndex={0}>
                <table className="table table-bordered table-striped ">
                  <thead>
                    <tr>
                      <th>{userRole != 'user' ? 'Customer Name' : 'Booking Id'}</th>
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
                    {loading && (
                      <tr>
                        <td colSpan={9}>
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {!loading && list?.entries?.length == 0 && (
                      <tr>
                        <td colSpan={9}>
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
                          <td>
                            {userRole != 'user' ? `${item['28.3']}` + ' ' + `${item['28.6']}`: item.id}
                          </td>
                          <td>
                            {changeDateFormat(item['date_created'].split(' ')[0],'dashboard')}
                          </td>
                          <td>
                            {formatDate(item['110'])}
                          </td>
                          <td className="status">
                            <span className={getClass(item['134'])}>{item['134'] ==='Request Received' && userRole != 'author' ? 'Waitlisted': item['134']}</span>
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
            <div>
            </div>
          </div>
        </div>

        {
          (list.total_count / filterData.per_page) > 1 &&
					<Pagination
					  current_page={filterData.page}
					  per_page={filterData.per_page}
					  total_pages={Math.ceil(list.total_count / filterData.per_page)}
					  total_items={list.total_count}
					  onClick={(i: { [key: string]: number }) => {
					    setFilterData((prev) => ({
					      ...prev,
					      page: i.selected + 1
					    }))
					  }}

					/>
        }
      </div>
    </DashboardLayout>
  )
}

export default BookingHistory