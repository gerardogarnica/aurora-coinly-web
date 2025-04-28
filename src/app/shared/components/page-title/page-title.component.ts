import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [],
  template: `
    <h1 class="text-2xl text-coinly-primary font-bold mb-2">
      {{ title }}
    </h1>
    @if (subtitle) {
    <p class="text-base text-gray-600 mb-6">
      {{ subtitle }}
    </p>
    }
  `
})
export class PageTitleComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
}
