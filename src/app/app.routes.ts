import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@shared/layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('@features/dashboard/pages/dashboard.component'),
            },
            {
                path: 'categories',
                loadComponent: () => import('@features/categories/pages/categories.component'),
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
