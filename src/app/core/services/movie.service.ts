import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable()
export class MovieService {

  constructor(
    private http: HttpClient
  ) {
  }

  getMovies(lang = 'es-MX'): Observable<Response> {
    let params = new HttpParams().set('language', lang);

    return this.http.get<Response>(environment.apiUrl + 'trending/movie/day', { params });
  }

}
