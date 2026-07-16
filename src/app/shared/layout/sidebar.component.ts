import { Component, computed, inject, input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { BreakpointService } from '@core/services/breakpoint.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule, MenuModule, TooltipModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent{
    private readonly breakpoint = inject(BreakpointService);

    readonly isOpen = input(false);
    readonly isMobile = this.breakpoint.isMobile;

    // Rail mode only exists on large screens: tablet still fully hides, mobile is the off-canvas drawer.
    readonly isRailCollapsed = computed(() => this.breakpoint.isDesktop() && !this.isOpen());

    readonly asideClasses = computed(() => {
        const base = 'h-screen bg-coinly-secondary flex flex-col justify-between overflow-y-auto font-rubik text-coinly-light z-50 transition-all duration-200 ease-out';

        if (this.isMobile()) {
            return `${base} w-64 px-4 fixed inset-y-0 left-0 ${this.isOpen() ? 'translate-x-0' : '-translate-x-full'}`;
        }

        if (this.isRailCollapsed()) {
            return `${base} w-20 px-2 static translate-x-0`;
        }

        return this.isOpen() ? `${base} w-64 px-4 static translate-x-0` : 'hidden';
    });

    readonly itemClasses = computed(() => {
        const base = 'flex items-center text-coinly-light hover:bg-coinly-primary rounded-lg transition-colors';

        return this.isRailCollapsed()
            ? `${base} justify-center px-0 py-3`
            : `${base} px-4 py-3`;
    });

    readonly iconClasses = computed(() => (this.isRailCollapsed() ? '' : 'mr-3'));

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
            label: 'Budgets',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/budgets']
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
