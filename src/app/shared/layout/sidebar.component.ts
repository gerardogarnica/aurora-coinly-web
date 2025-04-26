import { Component } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, faHome, faReceipt, faTags, faWallet, faCoins, faChartBar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  faCoffee = faCoffee;
  faHome = faHome;
  faReceipt = faReceipt;
  faTags = faTags;
  faWallet = faWallet;
  faCoins = faCoins;
  faChartBar = faChartBar;

  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faHome, faReceipt, faTags, faWallet, faCoins, faChartBar);
  }
}