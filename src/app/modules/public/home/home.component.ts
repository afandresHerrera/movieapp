import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Genre } from 'src/app/core/models/Genre';
import { Product } from 'src/app/core/models/Product';
import { TabName } from 'src/app/core/models/TabName';
import { Result } from 'src/app/core/models/result';
import { MovieService } from 'src/app/core/services/movie.service';
import { environment } from 'src/environments/environment';
import { operations } from '../../../utils/operations';

interface ProductView extends Omit<Result, 'genre_ids'> {
  genre_ids: Genre[]
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  imgUrl = environment.imgUrl;
  movieGenres: Genre[] = [];
  tvGenres: Genre[] = [];
  selectedTab: Product = 'movie';
  movies: ProductView[] | [] = [];
  tvShows: ProductView[] | [] = [];
  tabNames: TabName[] = [
    {
      genre_name: 'movie',
      tab_name: 'peliculas'
    },
    {
      genre_name: 'tv',
      tab_name: 'series'
    }
  ]

  testMovie = {
    "adult": false,
    "backdrop_path": "/o7JVhqMmrex1TPbmuxl8YXVlcfl.jpg",
    "genre_ids": [
      { "id": 28, "name": "Acción" },
      { "id": 35, "name": "Comedia" },
      { "id": 14, "name": "Fantasía" }
    ],
    "id": 287947,
    "original_language": "en",
    "original_title": "Shazam!",
    "overview": "Billy Batson, un chico astuto de 14 años, puede transformarse mágicamente en el superhéroe adulto Shazam. Sus poderes se pondrán a prueba contra el malvado Dr. Thaddeus Sivana.",
    "popularity": 43.666,
    "poster_path": "/4f5Rz8uYpcTvo1hHKcQRSaay0ek.jpg",
    "release_date": "2019-03-29",
    "title": "¡Shazam!",
    "video": false,
    "vote_average": 7.036,
    "vote_count": 8750
  };

  constructor(
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.getMovies();

    // this.getTVShows();
  }

  getMovies() {

    this.movieService.getGenres('movie').subscribe(res => {
      this.movieGenres = res;
      console.log(this.movieGenres);
      this.movieService.getTrending('movie').subscribe(res => {
        this.movies = res.results.map(item => {
          let genres = item.genre_ids.map(id => {
            return this.getGenreName(id, 'movie');
          });
          return <ProductView>{
            ...item,
            genre_ids: genres
          }
        })
      });
      console.log(this.movies);
    });
  }

  getTVShows() {

    this.movieService.getGenres('tv').subscribe(res => {
      this.tvGenres = res;

      this.movieService.getTrending('tv').subscribe(res => {
        // this.tvShows = res.results;
      });
    });

  }

  changeTab(tabEvent: MatTabChangeEvent) {
    console.log(tabEvent);
    const tab = tabEvent.tab;
    console.log(tab.textLabel.toLowerCase());
  }

  getTabName(genre: Product) {
    return this.tabNames.find(x => x.genre_name === genre)?.tab_name || '';
  }

  getGenreName(id: number, type: Product) {
    console.log(id, type);
    let genreObj;
    if (type === 'movie') {
      genreObj = this.movieGenres.find(x => x.id === id);
    } else {
      genreObj = this.tvGenres.find(x => x.id === id);
    }

    return genreObj ?? null;
  }

  getRatedNumber(rating: number): number {
    return operations.getRatedStar(rating);
  }
}
