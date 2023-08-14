import { Component, EventEmitter, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';


@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  search: string = '';

  constructor(private movieService: MovieService) { }

  emitSearch(event: Event): void {
    const target = event?.target as HTMLInputElement;
    const value = target.value;

    if (value && value !== '') {
      this.sendSearch(value);
    } else if (value === '') {
      this.sendSearch(value);
    }
  }

  sendSearch(searchValue: string) {
    this.movieService.setSearch(searchValue);
  }

  modelChanged(value: string) {
    if (value === '') {
      this.sendSearch(value);
    }
  }
}
