import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';
import { Genre } from '../models/Genre';
import { sessionPersistence } from '../../utils/session-persistence';
import { tmdbResponse } from '../models/result';

@Injectable()
export class MovieService {

  constructor(
    private http: HttpClient
  ) {
  }

  // getMovies(lang = 'es-MX'): Observable<tmdbResponse> {
  //   let params = new HttpParams().set('language', lang);

  //   return this.http.get<tmdbResponse>(environment.apiUrl + 'trending/movie/day', { params });
  // }

  // getTVShows(lang = 'es-MX'): Observable<tmdbResponse> {
  //   let params = new HttpParams().set('language', lang);

  //   return this.http.get<tmdbResponse>(environment.apiUrl + 'trending/tv/day', { params });
  // }

  getTrending(type: Product = 'movie', lang = 'es-MX'): Observable<tmdbResponse> {
    let params = new HttpParams().set('language', lang);

    return this.http.get<tmdbResponse>(`${environment.apiUrl}trending/${type}/day`, { params });
  }

  getGenres(type: Product = 'movie', lang = 'es'): Observable<Genre[]> {
    let response: Genre[] = [];

    return new Observable<Genre[] | []>(obs => {
      let params = new HttpParams().set('language', lang);

      if (sessionPersistence.get(type + 'genres') === null) {
        this.http.get<{ genres: Genre[] }>(`${environment.apiUrl}genre/${type}/list`, { params }).subscribe(res => {
          sessionPersistence.set(type + 'genres', res.genres);
          response = sessionPersistence.get(type + 'genres');
          obs.next(response);
          obs.complete();
        });
      } else {
        response = sessionPersistence.get(type + 'genres');
        obs.next(response);
        obs.complete();
      }
    });
  }
}
