import { Component, inject, signal, ViewChild } from '@angular/core';

import { CategoryExpensesComponent } from '@features/dashboard/components/category-expenses/category-expenses.component';
import { MonthlyTrendsComponent } from '@features/dashboard/components/monthly-trends/monthly-trends.component';
import { RecentTransactionsComponent } from '@features/dashboard/components/recent-transactions/recent-transactions.component';
import { SummaryCardComponent } from '@features/dashboard/components/summary-card/summary-card.component';
import { UpcomingPaymentsComponent } from '@features/dashboard/components/upcoming-payments/upcoming-payments.component';
import { DashboardSummary } from '@features/dashboard/models/dashboard.model';
import { DashboardService } from '@features/dashboard/services/dashboard.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecentTransactionsComponent, CategoryExpensesComponent, MonthlyTrendsComponent, SummaryCardComponent, UpcomingPaymentsComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent {
  dashboardService = inject(DashboardService);
  messageService = inject(MessageService);

  dashboardData = signal<DashboardSummary | undefined>(undefined);

  @ViewChild(CategoryExpensesComponent) categoryExpensesComponent?: CategoryExpensesComponent;
  @ViewChild(MonthlyTrendsComponent) monthlyTrendsComponent?: MonthlyTrendsComponent;

  ngOnInit() {
    this.dashboardService
      .getDashboard()
      .subscribe({
        next: (data) => {
          this.dashboardData.set(data);

          setTimeout(() => {
            this.categoryExpensesComponent?.setChartData(data.expensesByCategory);
          });

          setTimeout(() => {
            this.monthlyTrendsComponent?.setChartData(data.monthlyTrends);
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
