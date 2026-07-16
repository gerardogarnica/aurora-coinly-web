import { Injectable, OnDestroy, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BreakpointService implements OnDestroy {
  private readonly mobileQuery = window.matchMedia('(max-width: 767px)');
  private readonly tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

  private readonly isMobileSignal = signal(this.mobileQuery.matches);
  private readonly isTabletSignal = signal(this.tabletQuery.matches);

  readonly isMobile = this.isMobileSignal.asReadonly();
  readonly isTablet = this.isTabletSignal.asReadonly();
  readonly isDesktop = computed(() => !this.isMobileSignal() && !this.isTabletSignal());

  private readonly onMobileChange = (event: MediaQueryListEvent) => this.isMobileSignal.set(event.matches);
  private readonly onTabletChange = (event: MediaQueryListEvent) => this.isTabletSignal.set(event.matches);

  constructor() {
    this.mobileQuery.addEventListener('change', this.onMobileChange);
    this.tabletQuery.addEventListener('change', this.onTabletChange);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.onMobileChange);
    this.tabletQuery.removeEventListener('change', this.onTabletChange);
  }
}
