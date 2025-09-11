import { Component } from '@angular/core';

import { MonthlyTrend } from '@features/dashboard/models/dashboard.model';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-monthly-trends',
  imports: [ChartModule],
  templateUrl: './monthly-trends.component.html'
})
export class MonthlyTrendsComponent {
  monthlyTrends: MonthlyTrend[] = [];
  chartData: any;
  chartOptions: any;

  setChartData(monthlyTrends: MonthlyTrend[]) {
    this.monthlyTrends = monthlyTrends;

    this.chartData = {
      labels: this.getChartLabels(),
      datasets: [
        {
          label: 'Incomes',
          data: monthlyTrends.map(t => t.income),
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          borderWidth: 5,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: monthlyTrends.map(t => t.expenses),
          backgroundColor: '#ef4444',
          borderColor: '#ef4444',
          borderWidth: 5,
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: true,
      radius: 5,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 8,
            font: { family: '"Rubik", "DM Sans", sans-serif', size: 12 }
          }
        }
      }
    };
  }

  getChartLabels(): string[] {
    return this.monthlyTrends.map(trend => {
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const labels = monthNames[trend.month - 1] + ' ' + trend.year.toString().slice(-2);
      return labels;
    }) || [];
  }
}
