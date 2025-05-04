import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';

import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [],
  templateUrl: './modal-dialog.component.html'
})
export class ModalDialogComponent {
  @Input({ required: true }) title = '';
  @Input() processStatus: ProcessStatus = 'init';
  @Output() close = new EventEmitter<void>();

  elementRef = inject(ElementRef);

  onDialogClick(event: MouseEvent): void {
    const dialogElement = this.elementRef.nativeElement.querySelector('dialog');
    if (event.target === dialogElement && this.processStatus !== 'loading') {
      this.onClose();
    }
  }

  onClose() {
    if (this.processStatus !== 'loading') {
      this.close.emit();
    }
  }
}
