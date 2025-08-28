import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  imports: [CommonModule],
  templateUrl: './summary-card.component.html'
})
export class SummaryCardComponent {
  @Input() backgroundColor: string = '';
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() value: number = 0;
  @Input() currency: string = '';
  @Input() showPercentageChange: boolean = true;
  @Input() percentageChange: number = 0;
  @Input() footerText: string = '';

  getSummaryCardIcon(percentageChange: number | undefined): string {
    if (percentageChange === undefined) {
      return 'pi-equals';
    }
    return percentageChange >= 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-left';
  }
}
