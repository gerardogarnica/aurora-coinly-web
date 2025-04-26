import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@shared/layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('@features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'categories',
                loadComponent: () => import('@features/categories/pages/categories.component').then(m => m.CategoriesComponent),
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
