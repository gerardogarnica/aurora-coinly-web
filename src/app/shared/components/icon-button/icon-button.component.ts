import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faPlus, faSave, faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '@shared/shared.module';
import { ButtonAction } from '@shared/models/button-action.model';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './icon-button.component.html'
})
export class IconButtonComponent {
  @Input() action: ButtonAction = 'none';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() title = '';
  @Output() buttonClick = new EventEmitter<void>();

  faPlus = faPlus;
  faSave = faSave;
  faEdit = faEdit;
  faTrash = faTrash;
  faTimes = faTimes;

  get buttonClasses(): string {
    const baseClasses = 'w-10 h-10 flex items-center justify-center rounded-lg shadow transition-colors focus:outline-none focus:border-coinly-primary focus:ring-1 focus:ring-coinly-primary text-coinly-light';
    const enabledClasses = 'hover:text-base cursor-pointer';
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
        return faPlus;
    }
  }

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
