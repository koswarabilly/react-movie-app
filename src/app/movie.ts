import { Reducer } from "redux";

export interface Movie {
  imdbID: string,
  Title: string,
  Year: string,
  Type: string,
  Poster: string,
};

export interface MovieDetail {
  Title: string,
  Year: string,
  Rated: string,
  Released: string,
  Runtime: string,
  Genre: string,
  Director: string,
  Writer: string,
  Actors: string,
  Plot: string,
  Language: string,
  Country: string,
  Awards: string,
  Poster: string,
  Ratings: Array<{
    Source: string,
    Value: string,
  }>,
  Metascore: string,
  imdbRating: string,
  imdbVotes: string,
  imdbID: string,
  Type: string,
  DVD: string,
  BoxOffice: string,
  Production: string,
  Website: string,
  Response: string
};

export enum MovieActionTypes {
  UPDATE_LIST = 'UPDATE_LIST',
};

interface MovieState {
  list: Array<Movie>;
};

const initialState = {
  list: [],
  page: 1,
  total: 0,
  s: "",
};

const reducer: Reducer<MovieState> = (state = initialState, action) => {
  switch (action.type) {
    case MovieActionTypes.UPDATE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export { reducer as MoviesReducer };

export function updateList(movies: MovieState | Partial<MovieState>) {
  return {
    type: MovieActionTypes.UPDATE_LIST,
    payload: movies,
  };
}
