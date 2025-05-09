import { Component } from '@angular/core';

import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent {} 