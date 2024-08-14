import { toast } from 'react-toastify';
import { _Object } from '@/utils/types';
import store from 'store';

export default class CommonService {
  baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  }

  private async handleTokenExpired(): Promise<string | null> {
    store.clearAll();
    // window?.location?.replace('/');

    return null;
  }

  async request(method: string, params?: object) {
    const headers: _Object = {
      'Content-Type': 'application/json',
      'Authorization': store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || '7FGzMoYvy7Zst3sJEQp'}`)?.length > 0 ? 'Bearer ' + store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`) : null
    };

    const config: RequestInit = { method, headers };

    if (params) {
      config.body = params instanceof FormData ? params : JSON.stringify(params);
    }

    try {
      const response = await fetch(`${this.baseURL}`, config);
      const res = await response.json();

      if (res.errors?.length > 0) {
        const error = res.errors[0];

        const errorMessage = error.message != 'Internal server error' ? stripHtmlTags(error.message) : ''

        if (errorMessage?.length > 0) {
          toast.error(stripHtmlTags(errorMessage), { autoClose: 3000 });
        }

        if (res?.data?.viewer === null || error.debugMessage?.includes('Expired token') || error.debugMessage?.includes('invalid-secret-key')) {
          const newAccessToken = await this.refreshAccessToken();

          if (newAccessToken) {
            // Retry the original request with the new access token
            headers.Authorization = `Bearer ${newAccessToken}`;
            const retryConfig: RequestInit = { method, headers, body: config.body };
            const retryResponse = await fetch(`${this.baseURL}`, retryConfig);
            const retryData = await retryResponse.json();
            return retryData;
          } else {
            // Redirect to login if token refresh fails
            return await this.handleTokenExpired();
          }
        }
      }

      return res;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      await this.handleTokenExpired();
      // store.clearAll();
      return error;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const token = store.get(process.env.NEXT_PUBLIC_ACCESS_TOKEN_REFRESH_KEY || '8FGzMoYvy7Zstyu3sJP')

    if (!token) return null;

    try {
      // Make a request to your server to refresh the access token using the refresh token
      const response: _Object = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation MyMutation {
              refreshJwtAuthToken(
                input: { jwtRefreshToken: "${token}" }
              ) {
                authToken
                clientMutationId
              }
            }
          `
        })
      });

      const responseData = await response.json();

      const newAccessToken = responseData?.data?.refreshJwtAuthToken?.authToken;

      // Update the stored access token
      store.set(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || '7FGzMoYvy7Zst3sJEQp', newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  async post(params = {}) {
    return await this.request('POST', params);
  }
}

function stripHtmlTags(htmlString: string): string {
  if (typeof window !== 'undefined') {
    // If running on the client side (browser), use DOMParser
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  } else {
    // If running on the server side, use a regex (basic HTML tag removal)
    return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
  }
}
