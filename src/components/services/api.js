import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY_API = '28348540-5acc26c4c4c16999acfb2f011';
export const fetchImg = async ({ query }, page) => {
  // console.log('query in fetch', query);
  // console.log('page in fetch', page);
  const response = await axios.get(
    `?q=${query}&page=${page}&key=${KEY_API}&image_type=photo&orientation=horizontal&per_page=12`
  );

  return response.data;
};
