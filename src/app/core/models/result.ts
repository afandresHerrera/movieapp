export interface tmdbResponse {
  page: number
  results: Movie[] | TVShow[]
  total_pages: number
  total_results: number
}

interface Result {
  adult: boolean
  backdrop_path: string
  id: number
  original_language: string
  overview: string
  poster_path: string
  media_type: string
  genre_ids: number[]
  popularity: number
  vote_average: number
  vote_count: number
}

export interface Movie extends Result {
  title: string
  original_title: string
  release_date: string
  video: boolean
}

export interface TVShow extends Result {
  name: string
  original_name: string
  first_air_date: string
  origin_country: string[]
}


