import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Genre } from 'src/app/core/models/Genre';
import { MovieDetail } from 'src/app/core/models/MovieDetail';
import { ProductType } from 'src/app/core/models/ProductType';
import { TVShowDetail } from 'src/app/core/models/TvShowDetail';
import { MovieService } from 'src/app/core/services/movie.service';
import { operations } from 'src/app/utils/operations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  imgUrl = environment.poster_path;
  productId: string = '';
  productType?: ProductType;
  movieGenres: Genre[] = [];
  tvGenres: Genre[] = [];
  productGenres: string[] = [];
  // product!: MovieDetail | TVShowDetail;
  product!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) { }

  ngOnInit() {
    console.log("entre aqui");
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      this.productId = params.get('id') || '';
      this.productType = params.get('type') as ProductType || null;

      if (!this.productId || !this.productType) {
        this.goBack();
      }
    });
    this.initData();
  }

  initData() {
    this.movieService.getGenres('movie').subscribe(res => {
      this.movieGenres = res;

      this.movieService.getGenres('tv').subscribe(res => {
        this.tvGenres = res;
        this.getProductDetail();
      });
    });
  }

  getRatedNumber(rating: number): number {
    return operations.getRatedStar(rating);
  }

  getGenreName(id: number) {
    let genreObj;

    if (this.productType === 'movie') {
      genreObj = this.movieGenres.find(x => x.id === id);
    } else {
      genreObj = this.tvGenres.find(x => x.id === id);
    }

    return genreObj ?? null;
  }

  getProductDetail() {
    if (!!this.productType) {
      this.movieService.getProductDetail(this.productId, this.productType).subscribe(res => {
        console.log(res);

        if (this.productType === 'movie') {
          this.product = res as MovieDetail;
        } else {
          this.product = res as TVShowDetail;
        }

        this.product.genres.forEach((item: Genre) => {
          const itemName = this.getGenreName(item.id)?.name || '';
    
          this.productGenres.push(itemName);
        });
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

