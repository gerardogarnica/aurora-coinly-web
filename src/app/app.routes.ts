import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@shared/layout/main-layout.component').then(m => m.MainLayoutComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
