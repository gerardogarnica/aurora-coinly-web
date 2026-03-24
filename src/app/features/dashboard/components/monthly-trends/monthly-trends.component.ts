import { Component, computed, input } from '@angular/core';

import { MonthlyTrend } from '@features/dashboard/models/dashboard.model';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-monthly-trends',
  imports: [ChartModule],
  templateUrl: './monthly-trends.component.html'
})
export class MonthlyTrendsComponent {
  monthlyTrends = input<MonthlyTrend[]>([]);

  chartData = computed(() => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const trends = this.monthlyTrends();

    return {
      labels: trends.map(t => monthNames[t.month - 1] + ' ' + t.year.toString().slice(-2)),
      datasets: [
        {
          label: 'Incomes',
          data: trends.map(t => t.income),
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          borderWidth: 5,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: trends.map(t => t.expenses),
          backgroundColor: '#ef4444',
          borderColor: '#ef4444',
          borderWidth: 5,
          tension: 0.4
        }
      ]
    };
  });

  readonly chartOptions = {
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
