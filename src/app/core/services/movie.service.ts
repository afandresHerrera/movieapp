import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { sessionPersistence } from '../../utils/session-persistence';
import { Genre } from '../models/Genre';
import { ProductType } from '../models/ProductType';
import { tmdbResponse } from '../models/result';
import { TVShowDetail } from '../models/TvShowDetail';
import { MovieDetail } from '../models/MovieDetail';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private _searchString = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  public get searchString() {
    return this._searchString;
  }

  setSearch(searchText: string) {
    this._searchString.next(searchText);
  }

  getTrending(type: ProductType = 'movie', page = 1, lang = 'es-MX'): Observable<tmdbResponse> {
    const objParams = {
      language: lang,
      page: page
    };
    const params = new HttpParams({ fromObject: objParams });

    return this.http.get<tmdbResponse>(`${environment.apiUrl}trending/${type}/day`, { params });
  }

  getProductDetail(productId: string, type: ProductType = 'movie', lang = 'es-MX'): Observable<MovieDetail | TVShowDetail> {
    const objParams = {
      language: lang
    };
    const params = new HttpParams({ fromObject: objParams });

    return this.http.get<MovieDetail | TVShowDetail>(`${environment.apiUrl}${type}/${productId}`, { params });
  }

  getGenres(type: ProductType = 'movie', lang = 'es'): Observable<Genre[]> {
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

  searchProduct(query: string, type: ProductType = 'movie', page: number = 1, lang = 'es'): Observable<tmdbResponse> {
    const objParams = {
      query: query,
      page: page,
      language: lang,
      include_adult: 'false'
    };
    const params = new HttpParams({ fromObject: objParams });

    return this.http.get<tmdbResponse>(`${environment.apiUrl}search/${type}`, { params });
  }
}
