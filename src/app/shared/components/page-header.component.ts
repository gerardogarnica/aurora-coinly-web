import { Component } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  template: `
  <section class="flex flex-col sm:flex-row w-full items-center justify-between mb-4 space-y-3 sm:space-y-0 sm:space-x-0 text-sm">
    <ng-content></ng-content>
  </section>
  `
})
export class PageHeaderComponent {

}
