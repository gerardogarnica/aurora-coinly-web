import { Routes } from '@angular/router';
import { privateGuard } from '@core/guards/private.guard';
import { publicGuard } from '@core/guards/public.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [privateGuard],
        canActivateChild: [privateGuard],
        loadComponent: () => import('@shared/layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('@features/dashboard/pages/dashboard.component'),
                data: {
                    title: 'Overview',
                    subtitle: 'Here\'s an dashboard of all of your incomes, expenses and balances.'
                }
            },
            {
                path: 'categories',
                loadComponent: () => import('@features/categories/pages/categories.component'),
                data: {
                    title: 'Categories',
                    subtitle: 'Manage your categories to organize your transactions and keep your finances on track.'
                }
            },
            {
                path: 'methods',
                loadComponent: () => import('@features/methods/pages/methods.component'),
                data: {
                    title: 'Methods',
                    subtitle: 'Manage your payment methods for paying your expenses.'
                }
            },
            {
                path: 'reports',
                loadComponent: () => import('@features/reports/pages/reports.component'),
                data: {
                    title: 'Reports',
                    subtitle: 'View your financial reports.'
                }
            },
            {
                path: 'transactions',
                loadComponent: () => import('@features/transactions/pages/transactions.component'),
                data: {
                    title: 'Transactions',
                    subtitle: 'View your transaction history.'
                }
            },
            {
                path: 'wallets',
                loadComponent: () => import('@features/wallets/pages/wallets.component'),
                data: {
                    title: 'Wallets',
                    subtitle: 'Manage your wallets for your personal accounts.'
                }
            },
            {
                path: 'settings',
                loadComponent: () => import('@features/settings/pages/settings.component'),
                data: {
                    title: 'Settings',
                    subtitle: 'Manage your application settings.'
                }
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        canActivate: [publicGuard],
        canActivateChild: [publicGuard],
        loadComponent: () => import('@shared/layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('@features/auth/pages/login/login.component')
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('@shared/pages/not-found.component').then(m => m.NotFoundComponent)
    }
];
