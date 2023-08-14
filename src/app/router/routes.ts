import { Routes } from '@angular/router';
import { SessionAuthGuard } from '../core/guards/session-auth.guard';
import { LayoutComponent } from "../layout/layout.component";

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [SessionAuthGuard],
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: '', loadChildren: () => import('../modules/public/home.module').then(m => m.HomeModule) },
        ]
    },

    // ruta 404
    { path: '**', redirectTo: '', pathMatch: 'full' }

];