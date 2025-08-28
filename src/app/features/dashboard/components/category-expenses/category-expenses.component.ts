import { Component } from '@angular/core';

import { CategoryExpense } from '@features/dashboard/models/dashboard.model';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-category-expenses',
  imports: [ChartModule],
  templateUrl: './category-expenses.component.html'
})
export class CategoryExpensesComponent {
  expensesByCategory: CategoryExpense[] = [];
  chartData: any;
  chartOptions: any;

  setChartData(expensesByCategory: CategoryExpense[]) {
    this.expensesByCategory = expensesByCategory;

    this.chartData = {
      labels: expensesByCategory.map(e => e.category),
      datasets: [
        {
          data: expensesByCategory.map(e => e.amount),
          backgroundColor: [
            'rgba(59,130,246,0.8)', // Coinly info
            'rgba(34,197,94,0.8)', // Coinly success
            'rgba(139,92,246,0.8)', // Coinly secondary
            'rgba(239,68,68,0.8)', // Coinly danger
            'rgba(251,191,36,0.8)', // Amarillo
            'rgba(16,185,129,0.8)', // Verde azulado
            'rgba(234,179,8,0.8)',  // Mostaza
            'rgba(220,38,38,0.8)',   // Rojo fuerte
            'rgba(14,165,233,0.8)', // Azul claro
            'rgba(168,85,247,0.8)'  // Morado
          ],
          hoverBackgroundColor: [
            'rgba(59,130,246,1)',
            'rgba(34,197,94,1)',
            'rgba(139,92,246,1)',
            'rgba(239,68,68,1)',
            'rgba(251,191,36,1)',
            'rgba(16,185,129,1)',
            'rgba(234,179,8,1)',
            'rgba(220,38,38,1)',
            'rgba(14,165,233,1)',
            'rgba(168,85,247,1)'
          ]
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: true,
      responsive: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            padding: 8,
            font: { size: 11 },
            usePointStyle: true,
          }
        }
      }
    };
  }

  /*
  getPieChartColors(): string[] {
    return this.expensesByCategory.map(expense => expense.color);
  }

  getPieChartHoverColors(): string[] {
    return this.expensesByCategory.map(expense => expense.hoverColor);
  }
  */
}
