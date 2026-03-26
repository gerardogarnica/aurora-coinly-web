import { Component, computed, input, signal } from '@angular/core';

import { DashboardWallet } from '@features/dashboard/models/dashboard.model';

import { ChartModule } from 'primeng/chart';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallets-summary',
  imports: [ChartModule, ToggleSwitchModule, FormsModule],
  templateUrl: './wallets-summary.component.html'
})
export class WalletsSummaryComponent {
  wallets = input<DashboardWallet[]>([]);

  onlyAvailable = signal(false);

  chartData = computed(() => {
    const wallets = this.wallets();
    const mode = this.onlyAvailable() ? 'available' : 'total';
    const positive = wallets.filter(w => (mode === 'total' ? w.totalAmount : w.availableAmount) > 0);
    return {
      labels: positive.map(w => w.name),
      datasets: [
        {
          data: positive.map(w => this.onlyAvailable() ? w.availableAmount : w.totalAmount),
          backgroundColor: positive.map(w => w.color),
          hoverBackgroundColor: positive.map(w => w.color)
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
