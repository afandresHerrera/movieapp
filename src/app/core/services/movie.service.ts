import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { sessionPersistence } from '../../utils/session-persistence';
import { Genre } from '../models/Genre';
import { Product } from '../models/Product';
import { tmdbResponse } from '../models/result';

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

  getTrending(type: Product = 'movie', page = 1, lang = 'es-MX'): Observable<tmdbResponse> {
    const objParams = {
      language: lang,
      page: page
    };
    const params = new HttpParams({ fromObject: objParams });

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

  searchProduct(query: string, type: Product = 'movie', page: number = 1, lang = 'es'): Observable<tmdbResponse> {
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
