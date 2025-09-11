import { Component } from '@angular/core';

import { Wallet } from '@features/wallets/models/wallet.model';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-wallets-summary',
  imports: [ChartModule],
  templateUrl: './wallets-summary.component.html'
})
export class WalletsSummaryComponent {
  wallets: Wallet[] = [];
  chartData: any;
  chartOptions: any;

  setChartData(wallets: Wallet[]) {
    this.wallets = wallets;

    this.chartData = {
      labels: this.wallets.map(w => w.name),
      datasets: [
        {
          data: this.wallets.map(w => w.totalAmount),
          backgroundColor: this.wallets.map(w => w.color),
          hoverBackgroundColor: this.wallets.map(w => w.color)
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      responsive: true,
      rotation: '270',
      circumference: '180',
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

}
