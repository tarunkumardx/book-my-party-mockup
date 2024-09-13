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
import ReactDatePicker from 'react-datepicker';

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
const BookingHistory = () => {
  const router: _Object = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const [list, setList] = useState<List>({ entries: [], total_count: 0 });
  const [filterOption, setFilterOption] = useState('all');
  const [isVendor, setIsVendor] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showCustomDate, setShowCustomDate] = useState(false);

  useEffect (()=>{
    const name = loggedInUser?.roles?.nodes?.some((item: _Object) => (item.name == 'author' || item.name == 'administrator'));
    name ? setIsVendor(true) : setIsVendor(false);
  },[loggedInUser])

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
  console.log(list)

  useEffect(() => {
    dispatch(setLoggedInUser())
    async function name() {
      setLoading(true)
      if (loggedInUser?.databaseId && filterOption ==='all') {
        const data = await bookingService.getAll(14, { ...filterData, user_id: loggedInUser.databaseId}, 'admin')
        if (data?.entries) {
          setList(data)
        } else {
          setList({ entries: [], total_count: 0 })
        }
        setLoading(false)
      }
    }

    setFilterData((pre: _Object) => ({
      ...pre,
      user_id: loggedInUser?.databaseId
    }))

    filterOption === 'all' ? name() : fetchData(filterOption,customStartDate,customEndDate,showCustomDate);
  }, [filterData.page, loggedInUser?.databaseId, isVendor])

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

  const fetchData = async (filterOption: string, customStartDate?: Date, customEndDate?: Date, showCustomDate?: boolean) => {
    const now = new Date();

    // Function to format date to "YYYY-MM-DD HH:mm:ss"
    function formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    let startDate= '';
    const endDate = showCustomDate && customEndDate && filterOption === 'custom' ? formatDate(customEndDate) : formatDate(now);
    console.log(endDate)
    if (customStartDate && showCustomDate && filterOption ==='custom') {
      startDate = formatDate(customStartDate);
    } else {
      // Use default date filtering based on the filter option
      switch (filterOption) {
      case 'daily':
        setShowCustomDate(false);
        startDate = formatDate(new Date(now.setDate(now.getDate() - 1)));
        break;
      case 'weekly':
        setShowCustomDate(false);
        startDate = formatDate(new Date(now.setDate(now.getDate() - 7)));
        break;
      case 'monthly':
        setShowCustomDate(false);
        startDate = formatDate(new Date(now.setMonth(now.getMonth() - 1)));
        break;
      case 'yearly':
        setShowCustomDate(false);
        startDate = formatDate(new Date(now.setFullYear(now.getFullYear() - 1)));
        break;
      case 'custom':
        setShowCustomDate(true);
        break;
      }
    }

    console.log(startDate)

    setLoading(true);

    try {
      if(filterOption !== 'all'){
        console.log(startDate)
        const data = await bookingService.getAll(
          14,
          { ...filterData, user_id: loggedInUser.databaseId },
          'admin',
          undefined,
          undefined,
          startDate,
          endDate
        );
        setList(data);}
      else{
        const data = await bookingService.getAll(14, { ...filterData, user_id: loggedInUser.databaseId}, 'admin')
        setList(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error accordingly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filterOption,customStartDate,customEndDate,showCustomDate);
  }, [filterOption, customStartDate,customEndDate,showCustomDate]);

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Bookings - Book My Party' } || ''} />

      <div className="booking">
        <h3>
					All Bookings
        </h3>
        <div>
          <select onChange={e => setFilterOption(e.target.value)} value={filterOption}>
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
          {showCustomDate && <>
            <div className="d-flex my-3">
              <div className="form-group-all-bookings">
                <p className="label-form">Starting Date</p><ReactDatePicker
                  selected={customStartDate}
                  onChange={(date: Date) => { setCustomStartDate(date)}}
                /></div>
              <div className="form-group-all-bookings">
                <p className="label-form">Ending Date</p> <ReactDatePicker
                  selected={customEndDate}
                  onChange={(date: Date) => { setCustomEndDate(date)}}
                /></div></div></>}

        </div>
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
                      <th>{isVendor ? 'Customer Name' : 'Booking Id'}</th>
                      <th>Booking Date</th>
                      <th>Party Date</th>
                      <th>Booking Status</th>
                      {!isVendor && <th>Outlet Name</th>}
                      <th>Package</th>
                      <th>Pax</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={8}>
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
                        <td colSpan={8}>
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
                            {isVendor ? `${item['28.3']}` + ' ' + `${item['28.6']}`: item.id}
                          </td>
                          <td>
                            {changeDateFormat(item['date_created'].split(' ')[0],'dashboard')}
                          </td>
                          <td>
                            {formatDate(item['110'])}
                          </td>
                          <td className="status">
                            <span className={getClass(item['134'])}>{item['134']}</span>
                          </td>
                          {!isVendor && <td className="d-flex gap-2">
                            <button onClick={() => getVenueSlug(item['112'], i)} className="btn btn-link">{item['113']}</button>
                            {(slugLoading.loading && slugLoading.index === i) &&
															<div className="d-flex justify-content-center align-items-center">
															  <div className="spinner-border spinner-border-sm" role="status">
															    <span className="visually-hidden">Loading...</span>
															  </div>
															</div>
                            }
                          </td>}
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