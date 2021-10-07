import axios from "axios";

const BASE_URL = "https://www.omdbapi.com";
const API_KEY = "de7e2b92";

export const get = async (params?: object) => {
  return await axios.get(`${BASE_URL}`, {
    params: {
      apikey: API_KEY,
      ...params
    },
  })
}
