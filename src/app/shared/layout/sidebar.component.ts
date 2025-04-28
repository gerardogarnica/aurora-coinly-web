import { Component } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { faTableColumns, faReceipt, faTags, faWallet, faCoins, faChartBar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  faTableColumns = faTableColumns;
  faReceipt = faReceipt;
  faTags = faTags;
  faWallet = faWallet;
  faCoins = faCoins;
  faChartBar = faChartBar;
}
