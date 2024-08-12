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
import { amountFormat } from '@/utils/helpers';
import Image from 'next/image';
import { CalendarView, ListView } from '@/assets/images';

type RootState = {
	session: {
		loggedInUser: _Object;
	};
};

const BookingHistory = () => {
	const router: _Object = useRouter();
	const dispatch = useDispatch<AppDispatch>()

	const { loggedInUser } = useSelector((state: RootState) => state.session);

	const [list, setList] = useState<_Object>({ entries: [], total_count: 0 })
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

	useEffect(() => {
		dispatch(setLoggedInUser())
		async function name() {
			setLoading(true)
			if (loggedInUser?.databaseId) {
				const venues = await listService.getVenuesIds(loggedInUser.databaseId)

				const venuesIds = venues.edges.map((item: _Object) => item.node.databaseId).join(',')

				const data = await bookingService.getAll(14, { ...filterData, user_id: loggedInUser.databaseId, venuesIds: venuesIds }, loggedInUser?.roles?.nodes?.some((item: _Object) => item.name != 'author') ? 'user' : 'admin')
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

		name()
	}, [filterData.page, loggedInUser?.databaseId])

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
							<div className="tab-pane fade show active" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab" tabIndex={0}>
								<table className="table table-bordered table-striped ">
									<thead>
										<tr>
											<th>Booking ID</th>
											<th>Guest Name</th>
											<th>Booking Date</th>
											<th>Timing</th>
											<th>Venue Name</th>
											<th>Amount</th>
											<th>Status</th>
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
														{item.id}
													</td>
													<td>{`${item['28.3']}` + ' ' + `${item['28.6']}`}</td>
													<td>
														{item['110']}
													</td>
													<td>
														{item['25']} Hours
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
													<td>
														{amountFormat(item['32'])}
													</td>
													<td className="status"><span className="complete">Completed</span></td>
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