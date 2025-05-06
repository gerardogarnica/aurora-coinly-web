import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { InputFieldColors, SelectFieldColors } from '@shared/models/control-colors.model';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, LargeButtonComponent, AutofocusDirective],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  @Input() category?: Category;
  @Input() mode: 'add' | 'update' = 'add';
  @Input() processStatus: ProcessStatus = 'init';
  @Input() submitError: string | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateCategory | UpdateCategory>();

  formBuilder = inject(FormBuilder);

  categoryForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    type: [{ value: 'Expense', disabled: false }, Validators.required],
    notes: ['', Validators.maxLength(1000)]
  });

  ngOnInit() {
    if (this.mode === 'update' && this.category) {
      this.categoryForm.patchValue({
        name: this.category.name,
        type: this.category.type,
        notes: this.category.notes
      });
      this.categoryForm.get('type')?.disable(); 
    }
  }

  get inputFieldColors(): string {
    return InputFieldColors;
  }

  get selectFieldColors(): string {
    return SelectFieldColors;
  }

  onCancel() {
    if (this.processStatus !== 'loading') {
      this.cancel.emit();
    }
  }

  onSave() {
    if (this.categoryForm.valid && this.processStatus !== 'loading') {
      this.processStatus = 'loading';
      const formValue = this.categoryForm.value;

      if (this.mode === 'update' && this.category) {
        const updateData: UpdateCategory = {
          ...formValue,
          categoryId: this.category.categoryId
        };
        this.save.emit(updateData);
      } else {
        this.save.emit(formValue as CreateCategory);
      }
    }
  }
}
