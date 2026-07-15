import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BudgetDetailComponent } from '@features/budgets/components/budget-detail/budget-detail.component';
import { NewBudgetFormComponent } from '@features/budgets/components/new-budget-form/new-budget-form.component';
import { Budget } from '@features/budgets/models/budget.model';
import { BudgetService } from '@features/budgets/services/budget.service';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { CommonUtils } from '@shared/utils/common.utils';

import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule, BudgetDetailComponent, NewBudgetFormComponent, PageHeaderComponent, AvatarModule, ButtonModule, DatePickerModule, TableModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './budgets.component.html'
})
export default class BudgetsComponent implements OnInit {
  private readonly budgetService = inject(BudgetService);
  private readonly messageService = inject(MessageService);

  budgets = signal<Budget[]>([]);
  selectedBudget = signal<Budget | undefined>(undefined);
  selectedYear = new Date();
  minYear = new Date(new Date().getFullYear() - 10, 0, 1);
  maxYear = new Date(new Date().getFullYear() + 10, 0, 1);

  showAddDialog = false;
  showDetailDialog = false;

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService.getBudgets(this.selectedYear.getFullYear()).subscribe({
      next: (budgets) => {
        this.budgets.set(budgets);
      },
      error: (error: string) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error loading budgets',
          detail: error,
          life: 2000
        });
      }
    });
  }

  onYearChange() {
    this.loadBudgets();
  }

  onAddBudget() {
    this.showAddDialog = true;
  }

  onViewDetail(budget: Budget) {
    this.selectedBudget.set(budget);
    this.showDetailDialog = true;
  }

  onAddFormDialogClose() {
    this.showAddDialog = false;
    this.loadBudgets();
  }

  onDetailDialogClose() {
    this.showDetailDialog = false;
    this.selectedBudget.set(undefined);
  }

  getCategoryIcon(group: string): string {
    return CommonUtils.getGroupIcon(group as any);
  }
}
