import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [],
  template: `
  <section class="mb-6 font-quicksand">
    <h1 class="text-2xl text-coinly-primary font-bold pb-2 border-b border-coinly-primary">
      {{ title }}
    </h1>
    @if (subtitle) {
    <p class="text-base text-coinly-disabled mt-2">
      {{ subtitle }}
      </p>
    }
  </section>
  `
})
export class PageTitleComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;

}
