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
  ];

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
          const genres = item.genre_ids.map(id => {
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
        this.tvShows = res.results.map(item => {
          const genres = item.genre_ids.map(id => {
            return this.getGenreName(id, 'tv');
          });

          return <ProductView>{
            ...item,
            genre_ids: genres
          }
        })
      });
      console.log(this.tvShows);
    });

  }

  changeTab(tabEvent: MatTabChangeEvent) {
    const tab = tabEvent.tab;
    const tabName = tab.textLabel.toLowerCase();

    if (tabName === 'series') {
      this.getTVShows();
    }
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
