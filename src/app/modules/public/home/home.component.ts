import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Genre } from 'src/app/core/models/Genre';
import { ProductType } from 'src/app/core/models/ProductType';
import { TabName } from 'src/app/core/models/TabName';
import { Movie, TVShow, tmdbResponse } from 'src/app/core/models/result';
import { MovieService } from 'src/app/core/services/movie.service';
import { environment } from 'src/environments/environment';
import { operations } from '../../../utils/operations';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

interface MovieView extends Omit<Movie, 'genre_ids'> {
  genre_ids: Genre[]
}

interface tvView extends Omit<TVShow, 'genre_ids'> {
  genre_ids: Genre[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  imgUrl = environment.imgUrl;
  movieGenres: Genre[] = [];
  tvGenres: Genre[] = [];
  selectedTab: string = 'peliculas';
  movies: MovieView[] | [] = [];
  tvShows: tvView[] | [] = [];
  subscription!: Subscription;
  currentSearch = '';
  searchQuery = '';
  updateTab = true;

  pageEvent!: PageEvent;
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initListeners();
    // this.getTVShows();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  initData() {
    this.movieService.getGenres('movie').subscribe(res => {
      this.movieGenres = res;

      this.movieService.getGenres('tv').subscribe(res => {
        this.tvGenres = res;
        // this.spinner
        this.updateData();
      });
    });
  }

  initListeners() {
    this.movieService.searchString.subscribe(searchValue => {
      this.searchQuery = searchValue;

      this.currentPage = 1;
      this.paginator.firstPage();
      this.updateData();
    });
  }

  updateData() {
    if (this.searchQuery !== '') {
      this.searchProduct();
    } else {
      if (this.selectedTab === 'series') {
        this.getTVShows();
      } else {
        this.getMovies();
      }
    }
  }

  searchProduct() {
    const name = this.searchQuery;
    let product = this.getGenreNameFromObj(this.selectedTab);

    this.movieService.searchProduct(name, product, this.currentPage).subscribe(res => {
      this.makeViewObj(res);
      this.updateTab = true;
    })
  }

  getMovies() {
    this.movieService.getTrending('movie', this.currentPage).subscribe(res => {
      this.makeViewObj(res);
    });
  }

  getTVShows() {
    this.movieService.getTrending('tv', this.currentPage).subscribe(res => {
      this.makeViewObj(res);
    });
  }

  makeViewObj(response: tmdbResponse) {
    this.currentPage = response.page;
    this.totalPages = response.total_pages;
    this.totalItems = response.total_results;

    if (this.selectedTab === 'series') {
      this.tvShows = response.results.map(item => {
        const genres = item.genre_ids.map(id => {
          return this.getGenreName(id, 'tv');
        });

        return <tvView>{
          ...item,
          genre_ids: genres
        }
      });
    } else {
      this.movies = response.results.map(item => {
        const genres = item.genre_ids.map(id => {
          return this.getGenreName(id, 'movie');
        });

        return <MovieView>{
          ...item,
          genre_ids: genres
        }
      })
    }
  }

  changeTab(tabEvent: MatTabChangeEvent) {
    const tab = tabEvent.tab;
    const tabName = tab.textLabel.toLowerCase();
    
    this.selectedTab = tabName;
    this.currentPage = 1;
    this.paginator.firstPage();
    // this.pageIndex = 0;

    console.log(this.updateTab);
    if (this.updateTab) {
      if (tabName === 'series') {
        console.log(tabName);
        if (this.searchQuery !== '') {
          this.searchProduct();
        } else {
          this.getTVShows();
        }
        this.updateTab = false;
      } else {
        console.log(tabName);
        if (this.searchQuery !== '') {
          this.searchProduct();
        } else {
          this.getMovies();
        }
        this.updateTab = false;
      }
    }
  }

  getTabName(genre: ProductType) {
    return this.tabNames.find(x => x.genre_name === genre)?.tab_name || '';
  }

  getGenreNameFromObj(tabName: string): ProductType {
    return this.tabNames.find(x => x.tab_name === tabName)?.genre_name as ProductType || '';
  }

  getGenreName(id: number, type: ProductType) {
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

  goToDetail(id: number) {
    const tabName = this.getGenreNameFromObj(this.selectedTab);

    this.router.navigate(['detail/'+ tabName  + '/' + id]);
  }

  changePage(event: PageEvent) {
    console.log(event);
    this.currentPage = event.pageIndex + 1;
    setTimeout(() => {
      this.updateData();
    }, 200);
  }
}
