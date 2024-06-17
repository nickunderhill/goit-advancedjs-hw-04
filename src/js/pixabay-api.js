import axios from "axios";

const apiKey = '44413668-2012401924f35061b4cb3018c';

const errorMessage = 'Oops! Something went wrong! Try realoding the page!';
const baseUrl = 'https://pixabay.com/api';

export async function getImages(searchQuery, page, perPage) {
  const {data} = await axios.get(`${baseUrl}/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
  return data;
}
