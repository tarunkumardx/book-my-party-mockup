import { _Object } from '@/utils/types'
import CommonBookingService from './common.booking.service'

class BookingService extends CommonBookingService {
  async create(params: _Object, formNumber: number) {
    return await this.post(params, formNumber, 'submissions')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAll(formNumber: number, filterData?: any, role?: string, id?: number, type?: string, startDate?: string, endDate?: string) {
    return await this.get({}, formNumber, filterData, 'entries', role, id, type, startDate, endDate)
  }

  async getDetials(id: number) {
    return await this.getSingle(id)
  }
  async updateDetails(entryId: number, meta_key:string, meta_value: string) {
    return await this.updateSingle(entryId, meta_key, meta_value);
  }
}

export const bookingService = new BookingService()