import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '54492402-008c237b79b4e7660b85c858e';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error.message ||
      'Request failed';
    throw new Error(message);
  }
}
