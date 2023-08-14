import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'detail', component: DetailComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    HomeComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [ ]
})
export class HomeModule { }
