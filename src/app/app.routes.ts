import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@shared/layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('@features/dashboard/pages/dashboard.component')                
            },
            {
                path: 'categories',
                loadComponent: () => import('@features/categories/pages/categories.component')                
            },
            {
                path: 'methods',
                loadComponent: () => import('@features/methods/pages/methods.component')                
            },
            {
                path: 'reports',
                loadComponent: () => import('@features/reports/pages/reports.component')                
            },
            {
                path: 'transactions',
                loadComponent: () => import('@features/transactions/pages/transactions.component')                
            },
            {
                path: 'wallets',
                loadComponent: () => import('@features/wallets/pages/wallets.component')                
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
