import { Component, Input } from '@angular/core';

import { NewTransactionFormComponent } from '@features/transactions/components/new-transaction-form/new-transaction-form.component';
import { SharedModule } from '@shared/shared.module';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NewTransactionFormComponent, SharedModule, ButtonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input({ required: true }) title: string = '';
  @Input() subtitle?: string;

  showNewTransactionDialog = false;

  onAddNewTransaction() {
    this.showNewTransactionDialog = true;
  }

  onAddNewTransactionDialogClose() {
    this.showNewTransactionDialog = false;
  }
}
