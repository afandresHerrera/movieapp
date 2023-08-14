import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
