import { Component, ElementRef, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-category-detail-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LargeButtonComponent, AutofocusDirective],
  templateUrl: './category-detail-dialog.component.html'
})
export class CategoryDetailDialogComponent implements OnInit {
  @Input() mode: 'add' | 'update' = 'add';
  @Input() category?: Category;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateCategory | UpdateCategory>();

  private formBuilder = inject(FormBuilder);
  private elementRef = inject(ElementRef);
  showDialog = true;
  processStatus: ProcessStatus = 'init';

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

  onDialogClick(event: MouseEvent): void {
    // Check if the click was on the dialog backdrop (the first child of the dialog)
    const dialogElement = this.elementRef.nativeElement.querySelector('dialog');
    if (event.target === dialogElement) {
      this.onCancel();
    }
  }

  onCancel(): void {
    if (this.processStatus !== 'loading') {
      this.close.emit();
    }
  }

  onSave(): void {
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

  onSaveSuccess(): void {
    this.processStatus = 'success';
    this.close.emit();
  }

  onSaveError(): void {
    this.processStatus = 'error';
  }
}
