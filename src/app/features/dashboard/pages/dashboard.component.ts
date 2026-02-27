import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TransactionNotificationService } from '@core/services/transaction-notification.service';
import { CategoryExpensesComponent } from '@features/dashboard/components/category-expenses/category-expenses.component';
import { MonthlyTrendsComponent } from '@features/dashboard/components/monthly-trends/monthly-trends.component';
import { RecentTransactionsComponent } from '@features/dashboard/components/recent-transactions/recent-transactions.component';
import { SummaryCardComponent } from '@features/dashboard/components/summary-card/summary-card.component';
import { UpcomingPaymentsComponent } from '@features/dashboard/components/upcoming-payments/upcoming-payments.component';
import { WalletsSummaryComponent } from '@features/dashboard/components/wallets-summary/wallets-summary.component';
import { DashboardSummary } from '@features/dashboard/models/dashboard.model';
import { DashboardService } from '@features/dashboard/services/dashboard.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecentTransactionsComponent, CategoryExpensesComponent, MonthlyTrendsComponent, SummaryCardComponent, UpcomingPaymentsComponent, WalletsSummaryComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent {
  dashboardService = inject(DashboardService);
  messageService = inject(MessageService);
  transactionNotificationService = inject(TransactionNotificationService);
  destroyRef = inject(DestroyRef);

  dashboardData = signal<DashboardSummary | undefined>(undefined);

  @ViewChild(CategoryExpensesComponent) categoryExpensesComponent?: CategoryExpensesComponent;
  @ViewChild(MonthlyTrendsComponent) monthlyTrendsComponent?: MonthlyTrendsComponent;
  @ViewChild(WalletsSummaryComponent) walletsSummaryComponent?: WalletsSummaryComponent;

  ngOnInit() {
    this.transactionNotificationService.transactionCreated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadDashboard());

    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService
      .getDashboard()
      .subscribe({
        next: (data) => {
          this.dashboardData.set(data);

          setTimeout(() => {
            this.categoryExpensesComponent?.setChartData(data.expensesByCategory, data.expensesByGroup);
          });

          setTimeout(() => {
            this.monthlyTrendsComponent?.setChartData(data.monthlyTrends);
          });

          setTimeout(() => {
            this.walletsSummaryComponent?.setChartData(data.wallets);
          });
        },
        error: (error: string) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error loading dashboard',
            detail: error,
            life: 2000
          });
        }
      });
  }
}
