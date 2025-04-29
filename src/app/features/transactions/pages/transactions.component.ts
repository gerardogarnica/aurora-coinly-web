import { Component } from '@angular/core';

import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './transactions.component.html'
})
export default class TransactionsComponent {

}
