import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { NewTransactionFormComponent } from '@features/transactions/components/new-transaction-form/new-transaction-form.component';
import { SharedModule } from '@shared/shared.module';
import { BreakpointService } from '@core/services/breakpoint.service';

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
  @Output() toggleDrawer = new EventEmitter<void>();

  private readonly breakpoint = inject(BreakpointService);
  readonly isMobile = this.breakpoint.isMobile;

  showNewTransactionDialog = false;

  onAddNewTransaction() {
    this.showNewTransactionDialog = true;
  }

  onAddNewTransactionDialogClose() {
    this.showNewTransactionDialog = false;
  }

  onToggleDrawer() {
    this.toggleDrawer.emit();
  }
}
