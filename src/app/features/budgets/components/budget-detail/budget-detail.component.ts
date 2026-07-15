import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BudgetService } from '@features/budgets/services/budget.service';
import { Budget, BudgetPeriod, UpdateBudget } from '@features/budgets/models/budget.model';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputNumberModule, TableModule, TagModule, ToastModule],
  providers: [MessageService, CurrencyPipe],
  templateUrl: './budget-detail.component.html'
})
export class BudgetDetailComponent {
  @Input() budget: Budget | undefined;
  @Input() processStatus: ProcessStatus = 'none';
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  private readonly budgetService = inject(BudgetService);
  private readonly messageService = inject(MessageService);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly destroyRef = inject(DestroyRef);

  budgetDetail: Budget | undefined;
  editingPeriodId: string | null = null;
  editAmountLimit: number = 0;
  savingPeriodId: string | null = null;
  expandedKeys: { [key: string]: boolean } = {};

  showDialogForm() {
    this.processStatus = 'init';
    this.editingPeriodId = null;
    this.expandedKeys = {};
    this.budgetDetail = undefined;

    if (this.budget) {
      this.loadBudgetDetail(this.budget.budgetId);
    }
  }

  hideDialogForm() {
    this.processStatus = 'none';
    this.showDialog = false;
    this.editingPeriodId = null;
    this.budgetDetail = undefined;
    this.cancelAction.emit();
  }

  loadBudgetDetail(budgetId: string) {
    this.processStatus = 'loading';
    this.budgetService.getBudgetById(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.budgetDetail = detail;
          this.processStatus = 'init';
        },
        error: (error: string) => {
          this.processStatus = 'error';
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading budget detail',
            detail: error,
            life: 2000
          });
        }
      });
  }

  onEditPeriod(period: BudgetPeriod) {
    this.editingPeriodId = period.periodId;
    this.editAmountLimit = period.amountLimit;
  }

  onCancelEdit() {
    this.editingPeriodId = null;
  }

  onSavePeriod(period: BudgetPeriod) {
    if (!this.budgetDetail || this.savingPeriodId === period.periodId) {
      return;
    }

    this.savingPeriodId = period.periodId;

    const request: UpdateBudget = {
      periodId: period.periodId,
      newAmountLimit: this.editAmountLimit
    };

    this.budgetService.updateBudget(this.budgetDetail.budgetId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.savingPeriodId = null;
          this.editingPeriodId = null;

          this.messageService.add({
            severity: 'success',
            summary: 'Period updated',
            detail: 'The period amount limit has been updated.',
            life: 2000
          });

          this.loadBudgetDetail(this.budgetDetail!.budgetId);
        },
        error: (error: string) => {
          this.savingPeriodId = null;
          this.messageService.add({
            severity: 'error',
            summary: 'Error updating period',
            detail: error,
            life: 2000
          });
        }
      });
  }

  getSpentPercentage(period: BudgetPeriod): number {
    if (period.amountLimit <= 0) return 0;
    return Math.min((period.spentAmount / period.amountLimit) * 100, 100);
  }

  formatCurrency(amount: number, currencyCode?: string): string {
    return this.currencyPipe.transform(amount, currencyCode || 'USD', 'symbol', '1.2-2') || '';
  }
}
