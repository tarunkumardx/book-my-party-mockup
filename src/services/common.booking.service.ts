import { _Object } from '@/utils/types';

export default class CommonBookingService {
  baseURL: string;

  constructor() {
    // ck_648627f0c72980735d0abfa670eb66e306940ad6
    // cs_3e99453cd71c5ede44674ddd2b7ea9d7f9f34d79
    this.baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(method: string, params?: _Object, formNumber?: number, endPoint?: string, filterData?: any, role?: any, id?: number, type?: string) {
    const domain = new URL(this.baseURL).hostname;

    const headers: _Object = {
      'Content-Type': 'application/json',
      // 'Authorization': 'Basic Y2tfM2NjZGRlN2ZmMWFhNzljNTk3MGJlNmY1ODRjYzVmNWYxYzQ3ODAxZDpjc18yNDg4YTIyZTQ4MzJjODNhM2YwZDFkMWJiZGY3NjliYzdmODBkZTlm'
      'Authorization': `Basic ${process.env.NEXT_PUBLIC_BOOKING_TOKEN ? process.env.NEXT_PUBLIC_BOOKING_TOKEN : 'Y2tfMWNkMTMzYmU1YjA0OGM4ZDZhOWYyNjFmZjBkYjYzYjhiMzk4ZTk4NTpjc19mY2JlMDg1YmE0MjgyZTk0NDQ2OGFjNDQ3ODRmZDU2MzY0ODBiNTE2'}`
    };

    const config: RequestInit = { method, headers };

    if (method === 'POST') {
      config.body = JSON.stringify(params);
    }

    let key
    console.log(filterData?.user_id)
    if (role === 'user') {
      key = `{"field_filters":[{"key":115,"value":${filterData?.user_id},"operator":"contains"}]}`
    } else {
      // key = `{"field_filters":[{"key":114,"value":${filterData?.user_id},"operator":"contains"},{"key":112,"value":[${filterData?.venuesIds}],"operator":"IN"}]}`
      key = `{"field_filters":[{"key":122,"value":"${filterData?.user_id}","operator":"contains"}]}`
    }

    let url = ''

    if (type === 'single') {
      url = `https://${domain}/wp-json/gf/v2/entries/${id}`
    } else {
      url = `https://${domain}/wp-json/gf/v2/forms/${formNumber}/${endPoint}?paging[page_size]=${filterData?.per_page}&paging[current_page]=${filterData?.page}&search=${key}`
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error;
    }
  }

  async post(params = {}, formNumber: number, endPoint: string) {
    return await this.request('POST', params, formNumber, endPoint);
  }

  async get(params: object, formNumber: number, filterData: object, endPoint: string, role?: string) {
    return await this.request('GET', params, formNumber, endPoint, filterData, role);
  }

  async getSingle(id: number) {
    return await this.request('GET', {}, 0, 'endPoint', {}, '', id, 'single');
  }
}