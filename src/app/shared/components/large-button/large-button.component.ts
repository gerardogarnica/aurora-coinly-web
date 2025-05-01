import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faSave, faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ButtonAction } from '@shared/models/button-action.model';

@Component({
  selector: 'app-large-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './large-button.component.html'
})
export class LargeButtonComponent {
  @Input() text = '';
  @Input() action: ButtonAction = 'none';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<void>();

  faPlus = faPlus;
  faSave = faSave;
  faEdit = faEdit;
  faTrash = faTrash;
  faTimes = faTimes;

  get buttonClasses(): string {
    const baseClasses = 'px-5 py-2 text-coinly-light hover:font-bold rounded-lg shadow transition-colors focus:outline-none focus:border-coinly-primary focus:ring-1 focus:ring-coinly-primary';
    const enabledClasses = 'cursor-pointer';
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    let colorClasses = '';
    switch (this.action) {
      case 'new':
        colorClasses = 'bg-coinly-info hover:bg-coinly-info-dark';
        break;
      case 'edit':
        colorClasses = 'bg-coinly-edit hover:bg-coinly-edit-dark';
        break;
      case 'save':
        colorClasses = 'bg-coinly-success hover:bg-coinly-success-dark';
        break;
      case 'delete':
        colorClasses = 'bg-coinly-danger hover:bg-coinly-danger-dark';
        break;
      case 'cancel':
        colorClasses = 'bg-coinly-cancel hover:bg-coinly-cancel-dark';
        break;
      default:
        colorClasses = 'bg-coinly-info hover:bg-coinly-info-dark';
    }

    return `${baseClasses} ${colorClasses} ${this.disabled ? disabledClasses : enabledClasses}`;
  }

  get icon() {
    switch (this.action) {
      case 'new':
        return faPlus;
      case 'save':
        return faSave;
      case 'edit':
        return faEdit;
      case 'delete':
        return faTrash;
      case 'cancel':
        return faTimes;
      default:
        return undefined;
    }
  }

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
