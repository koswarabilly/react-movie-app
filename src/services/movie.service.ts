import { get } from "./http.service";

export const searchMovie = async (s: string, y: string, page: number) => {
  return await get({s, y, page, type: 'movie', r: 'json'});
}

export const getMovieById = async (id: string) => {
  return await get({ i: id, type: 'movie', r: 'json' });
};
