import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BudgetService } from '@features/budgets/services/budget.service';
import { CreateBudget } from '@features/budgets/models/budget.model';
import { BudgetFrequency } from '@features/budgets/models/budget.types';
import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-new-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DatePickerModule, DialogModule, InputNumberModule, InputText, SelectModule, ToastModule],
  providers: [MessageService],
  templateUrl: './new-budget-form.component.html'
})
export class NewBudgetFormComponent implements OnInit {
  @Input() processStatus: ProcessStatus = 'none';
  @Input() showDialog: boolean = false;
  @Output() cancelAction = new EventEmitter<void>();

  private readonly budgetService = inject(BudgetService);
  private readonly categoryService = inject(CategoryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  categories: Category[] = [];
  minYear = new Date(new Date().getFullYear() - 10, 0, 1);
  maxYear = new Date(new Date().getFullYear() + 10, 0, 1);

  frequencyOptions = Object.values(BudgetFrequency).map(value => ({
    label: value.replace(/([a-z])([A-Z])/g, '$1 $2'),
    value
  }));

  budgetForm: FormGroup = this.formBuilder.group({
    categoryId: ['', [Validators.required]],
    year: [new Date(), [Validators.required]],
    frequency: ['', [Validators.required]],
    currencyCode: [''],
    amountLimit: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories(false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });
  }

  showDialogForm() {
    this.processStatus = 'init';
    this.resetForm();
  }

  hideDialogForm() {
    this.resetForm();
    this.processStatus = 'none';
    this.showDialog = false;
    this.cancelAction.emit();
  }

  resetForm() {
    this.budgetForm.reset({
      categoryId: '',
      year: new Date(),
      frequency: '',
      currencyCode: '',
      amountLimit: 0
    });
    this.processStatus = 'init';
  }

  onSave() {
    if (!this.budgetForm.valid || this.processStatus === 'loading') {
      return;
    }

    this.processStatus = 'loading';
    const formValue = this.budgetForm.value;

    const request: CreateBudget = {
      categoryId: formValue.categoryId,
      year: (formValue.year as Date).getFullYear(),
      frequency: formValue.frequency,
      amountLimit: formValue.amountLimit,
      ...(formValue.currencyCode ? { currencyCode: formValue.currencyCode } : {})
    };

    this.budgetService.createBudget(request).subscribe({
      next: () => {
        this.processStatus = 'success';
        this.messageService.add({
          severity: 'success',
          summary: 'Budget created',
          detail: 'The budget has been successfully created.',
          life: 2000
        });
        this.hideDialogForm();
      },
      error: (error: string) => {
        this.processStatus = 'error';
        this.messageService.add({
          severity: 'error',
          summary: 'Error creating budget',
          detail: error,
          life: 2000
        });
      }
    });
  }
}
