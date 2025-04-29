import { Component } from '@angular/core';

import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './wallets.component.html'
})
export default class WalletsComponent {

}
