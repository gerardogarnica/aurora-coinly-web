import { Component } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  template: `
  <section class="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-3 sm:space-y-0 sm:space-x-16 text-sm">
    <ng-content></ng-content>
  </section>
  `
})
export class PageHeaderComponent {

}
