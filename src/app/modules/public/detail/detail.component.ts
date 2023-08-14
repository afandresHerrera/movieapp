import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  productId: string = '';
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log("entre aqui");
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      this.productId = params.get('id') || '';
      console.log(this.productId);

      // if (this.id && this.id !== '') {
      //   this.getDetails();
      // } else {
      //   this.goBack();
      // }
    });
  }

}
