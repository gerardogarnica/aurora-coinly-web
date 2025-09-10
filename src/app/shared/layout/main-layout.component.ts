import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared/layout/navbar.component';
import { SidebarComponent } from '@shared/layout/sidebar.component';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);

  pageHeaderTitle = '';
  pageHeaderSubtitle = '';

  ngOnInit() {
    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, this.router.url, this.router.url)),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => {
          let firstChild = this.router.routerState.root;

          while (firstChild.firstChild) {
            firstChild = firstChild.firstChild;
          }

          return firstChild;
        })
      )
      .subscribe((route: ActivatedRoute) => {
        const data = route.snapshot.data;
        if (data['title']) {
          this.pageHeaderTitle = data['title'];
          this.pageHeaderSubtitle = data['subtitle'] || '';
        }
      });
  }
}