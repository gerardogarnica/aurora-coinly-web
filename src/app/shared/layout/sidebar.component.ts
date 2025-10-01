import { Component } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule, MenuModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent{
    sidebarMenu: MenuItem[] = [
        {
            label: 'Overview',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/dashboard']
        },
        {
            label: 'Transactions',
            icon: 'pi pi-fw pi-receipt',
            routerLink: ['/transactions']
        },
        {
            label: 'Wallets',
            icon: 'pi pi-fw pi-wallet',
            routerLink: ['/wallets']
        },
        {
            label: 'Categories',
            icon: 'pi pi-fw pi-tags',
            routerLink: ['/categories']
        },
        {
            label: 'Payment Methods',
            icon: 'pi pi-fw pi-credit-card',
            routerLink: ['/methods']
        },
        {
            label: 'Reports',
            icon: 'pi pi-fw pi-table',
            routerLink: ['/reports']
        }
    ];
}
