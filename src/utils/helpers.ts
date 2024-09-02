/* eslint-disable no-unsafe-optional-chaining */
import moment from 'moment';

export const formatDate = (dateString: string): string => {
  const [day, month, year] = dateString.split('-');
  const formattedDateString = `${day}/${month}/${year}`;

  return formattedDateString;
};

export const truncateText = (paramsText: string, show = 15) => {
  const words = paramsText?.split(' ');
  const truncatedText = words?.slice(0, show)?.join(' ');
  return `${truncatedText}`;
}

export const truncateTextMore = (paramsText: string, show = 30) => {
  const words = paramsText?.split('');
  const truncatedText = words?.slice(0, show)?.join('');
  return `${truncatedText}...`;
}

export const truncateToWords = (paramsText: string, wordLimit = 13): string => {
  if (!paramsText) return '';

  const words = paramsText.split(' ');
  const truncatedText = words.slice(0, wordLimit).join(' ');

  return `${truncatedText}....`;
}

export const capitalize = (params: string) => {
  if (!params) return '-';
  return params
    .replace(/(^\w{1})|(\s+\w{1})|(-\w{1})/g, letter => letter.toUpperCase())
    .replace(/-/g, ' ');
};

export const locationFormatted = (params: string) => {
  const stringWithoutHyphens = params?.replace(/-/g, ' ');

  return stringWithoutHyphens?.split('+')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    .join(', ');
}

//Close modals
export const closeModal = (selector = 'create') => {
  const closeButton = document.querySelectorAll(`#${selector} .modal-close`)

  if (closeButton[0] instanceof HTMLElement) {
    closeButton[0]?.click()
  }
}

export const amountFormat = (amount: string, type = 'float') => {
  if (type === 'float') {
    return `₹${parseFloat(amount).toFixed(2).toLocaleString()}`
  } else {
    return `₹${parseFloat(amount)}`
  }
}

export const uploadImages = async (fileInput: File) => {
  console.log(typeof fileInput)
  if (fileInput) {
    const formData = new FormData();
    formData.append('image', fileInput);
    formData.append('key', 'a05b670a163a3ee6996f5af9f8c3b201');

    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };

    const response = await fetch('https://api.imgbb.com/1/upload', requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();
    return data?.display_url
  }
};

export const changeDateFormat = (dateString: string, format = ''): string | null => {
  const parts = dateString?.split('-');
  if (parts?.length === 3 && format === '') {
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
  } else if (parts?.length === 3 && format === 'date') {
    return `${parts[1]}/${parts[0]}/${parts[2]}`;
  } else if (parts?.length === 3 && format === 'form') {
    return `${parts[1]}-${parts[0]}-${parts[2]}`;
  } else if (parts?.length === 3 && format === 'dashboard') {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } else {
    return null;
  }
}

export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber?.length > 0 && !phoneNumber?.includes('+91')) {
    const phoneStr = phoneNumber.toString();

    const countryCode = phoneStr.slice(0, 2);
    let mainNumber = phoneStr.slice(2);

    mainNumber = mainNumber.replaceAll(' ', '');

    return `+${countryCode} ${mainNumber}`;
  } else if (phoneNumber?.length > 0) {
    const phoneStr = phoneNumber.toString();

    const countryCode = phoneStr.slice(0, 3);
    let mainNumber = phoneStr.slice(3);

    mainNumber = mainNumber.replaceAll(' ', '');

    return `${countryCode} ${mainNumber}`;
  } else {
    return ''
  }
}

export const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export const dateFormaterForReactDatePicker = (date: string, format = 'MM-DD-YYYY') => {
  const parsedDate = new Date(moment(date, format).format('YYYY-MM-DDTHH:mm:ss'))
  return parsedDate ? parsedDate : null;
}

export const calculateDiscountPercentage = (originalPrice: number, salePrice: number) => {
  if (originalPrice <= 0) {
    throw new Error('Original price must be greater than zero.');
  }
  const discount = originalPrice - salePrice;
  const discountPercentage = (discount / originalPrice) * 100;
  return discountPercentage.toFixed(0); // To keep two decimal places
}