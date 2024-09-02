/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { _Object } from '@/utils/types'
import { DashboardLayout, SEOHead } from '@/components'
import { bookingService } from '@/services/booking.service'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { setLoggedInUser } from '@/redux/slices/session.slice'
import Link from 'next/link'
import { listService } from '@/services/venue.service'
import { useRouter } from 'next/router'

type RootState = {
	session: {
		loggedInUser: _Object;
	};
};

const BookingCalendar = () => {
  const router: _Object = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const [list, setList] = useState<_Object>({})
  const [loading, setLoading] = useState(false)
  const [filterData, setFilterData] = useState<_Object>({
    page: 1,
    per_page: 200,
    user_id: loggedInUser?.databaseId
  })
  const [slugLoading, setSlugLoading] = useState({
    loading: false,
    index: 0
  })
  const [dates, setDates] = useState<object>({})
  console.log('dates :>> ', dates);
  useEffect(() => {
    setLoading(true)
    dispatch(setLoggedInUser())
    async function name() {
      if (loggedInUser?.databaseId) {
        const data = await bookingService.getAll(6, { ...filterData, user_id: loggedInUser.databaseId }, loggedInUser?.roles?.nodes?.some((item: _Object) => item.name != 'author') ? 'user' : 'admin')
        setList(data)
        setLoading(false)
      }
    }

    setFilterData((pre: _Object) => ({
      ...pre,
      user_id: loggedInUser?.databaseId
    }))

    name()
  }, [loggedInUser?.databaseId])

  const getVenueSlug = async (venueId: number, index: number) => {
    setSlugLoading({
      loading: true,
      index: index
    })
    const result = await listService.getVenueSlug(venueId)

    if (result?.slug) {
      setSlugLoading({
        loading: false,
        index: index
      })

      router.push({
        pathname: `/venues/${result.slug}`
      });
    } else {
      alert('This venue is no longer available.')
    }
  }

  function renderEventContent(eventInfo: _Object) {
    return (
      <ul className="list-unstyled">
        <li className="d-flex">
          <button onClick={() => getVenueSlug(eventInfo.event.extendedProps.venueId, eventInfo.event.extendedProps.bookingId)} className="btn btn-link text-wrap">
            {eventInfo.event.title}
          </button>
          {(slugLoading.loading && slugLoading.index === eventInfo.event.extendedProps.bookingId) &&
						<div className="d-flex justify-content-center align-items-center">
						  <div className="spinner-border spinner-border-sm" role="status">
						    <span className="visually-hidden">Loading...</span>
						  </div>
						</div>
          }
        </li>
        <li>Booking ID : <Link href={`/dashboard/bookings/${eventInfo.event.extendedProps.bookingId}`}>{eventInfo.event.extendedProps.bookingId}</Link></li>
      </ul>
    )
  }

  return (
    <DashboardLayout>
      <SEOHead seo={{ title: 'Booking Calendar - Book My Party' } || ''} />
      <h3>
				Booking
      </h3>
      <div>
        <ul className="list-unstyled d-flex gap-3 justify-content-center">
          <li><Link className="btn btn-primary" href="/dashboard/bookings">Bookings</Link></li>
          <li><Link className="btn btn-primary" href="/dashboard/bookings/Booking">Bookings Calendar</Link></li>
        </ul>
      </div>

      {
        loading &&
				<div className="d-flex justify-content-center align-items-center">
				  <div className="spinner-border" role="status">
				    <span className="visually-hidden">Loading...</span>
				  </div>
				</div>
      }
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={list?.entries?.map((item: _Object) => { return { title: item['113'], start: new Date(item['110']), bookingId: item.id, venueId: item['112'] } })}
        eventContent={renderEventContent}
        datesSet={(e: object) => { setDates(e) }}
      />
    </DashboardLayout>
  )
}

export default BookingCalendar
