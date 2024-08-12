import { _Object } from '@/utils/types'
import CommonBookingService from './common.booking.service'

class BookingService extends CommonBookingService {
	async create(params: _Object, formNumber: number) {
		return await this.post(params, formNumber, 'submissions')
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getAll(formNumber: number, filterData?: any, role?: string) {
		return await this.get({}, formNumber, filterData, 'entries', role)
	}

	async getDetials(id: number) {
		return await this.getSingle(id)
	}
}

export const bookingService = new BookingService()