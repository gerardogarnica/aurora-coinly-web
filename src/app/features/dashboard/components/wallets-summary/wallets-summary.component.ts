import { Component, computed, input } from '@angular/core';

import { DashboardWallet } from '@features/dashboard/models/dashboard.model';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-wallets-summary',
  imports: [ChartModule],
  templateUrl: './wallets-summary.component.html'
})
export class WalletsSummaryComponent {
  wallets = input<DashboardWallet[]>([]);

  chartData = computed(() => {
    const wallets = this.wallets();
    return {
      labels: wallets.map(w => w.name),
      datasets: [
        {
          data: wallets.map(w => w.totalAmount),
          backgroundColor: wallets.map(w => w.color),
          hoverBackgroundColor: wallets.map(w => w.color)
        }
      ]
    };
  });

  readonly chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    rotation: 270,
    circumference: 180,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          padding: 8,
          font: { family: '"Rubik", "DM Sans", sans-serif', size: 12 },
          usePointStyle: true
        }
      }
    }
  };
}
