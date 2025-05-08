import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Method } from '@features/methods/models/method.model';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-delete-method-form',
  standalone: true,
  imports: [LargeButtonComponent],
  templateUrl: './delete-method-form.component.html'
})
export class DeleteMethodFormComponent {
  @Input() method?: Method;
  @Input() processStatus: ProcessStatus = 'init';
  @Input() submitError: string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onCancel() {
    if (this.processStatus !== 'loading') {
      this.cancel.emit();
    }
  }

  onSave() {
    if (this.processStatus !== 'loading') {
      this.save.emit();
    }
  }
}
