import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { ProcessStatus } from '@shared/models/process-status.model';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, ColorPickerModule, DialogModule, InputNumberModule, InputText, SelectModule, TextareaModule, ToastModule],
    providers: [MessageService],
    templateUrl: './category-form.component.html'
})
export class CategoryFormComponent {
    @Input() category?: Category;
    @Input() processStatus: ProcessStatus = 'none';
    @Input() showDialog: boolean = false;
    @Output() cancelAction = new EventEmitter<void>();

    categoryService = inject(CategoryService);
    formBuilder = inject(FormBuilder);
    messageService = inject(MessageService);

    categoryTypes = [
        { label: 'Expense', value: 'Expense' },
        { label: 'Income', value: 'Income' }
    ];

    categoryForm: FormGroup = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        color: ['#0000ff', [Validators.required]],
        type: [{ value: 'Expense', disabled: false }, Validators.required],
        maxDaysToReverse: [15, [Validators.required, Validators.min(0), Validators.max(15)]],
        notes: ['', Validators.maxLength(1000)]
    });

    getComponentTitle(): string {
        return this.category ? 'Edit Category' : 'Add New Category';
    }

    showDialogForm() {
        this.processStatus = 'init';

        if (this.category) {
            this.categoryForm.patchValue({
                name: this.category.name,
                color: this.category.color,
                type: this.category.type,
                maxDaysToReverse: this.category.maxDaysToReverse,
                notes: this.category.notes
            });

            this.categoryForm.get('type')?.disable();
        } else {
            this.resetForm();
        }
    }

    hideDialogForm() {
        this.resetForm();
        this.processStatus = 'none';
        this.showDialog = false;

        this.cancelAction.emit();
    }

    resetForm() {
        this.categoryForm.reset({
            name: '',
            color: '#0000ff',
            type: 'Expense',
            maxDaysToReverse: 15,
            notes: ''
        });

        this.categoryForm.get('type')?.enable();

        this.processStatus = 'init';
    }

    onSave() {
        if (this.categoryForm.valid && this.processStatus !== 'loading') {
            this.processStatus = 'loading';
            const formValue = this.categoryForm.value;

            if (this.category) {
                const updateData: UpdateCategory = {
                    ...formValue,
                    categoryId: this.category.categoryId
                };

                this.updateCategory(updateData);
            } else {
                const newCategory: CreateCategory = {
                    ...formValue
                };

                this.createCategory(newCategory);
            }
        }
    }

    createCategory(category: CreateCategory) {
        this.categoryService
            .createCategory(category)
            .subscribe({
                next: () => {
                    this.processStatus = 'success';

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Category created',
                        detail: `The category ${category.name} has been successfully created.`,
                        life: 2000
                    });

                    this.hideDialogForm();
                },
                error: (error: string) => {
                    this.processStatus = 'error';

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error creating category',
                        detail: error,
                        life: 2000
                    });
                }
            });
    }

    updateCategory(category: UpdateCategory) {
        this.categoryService
            .updateCategory(category)
            .subscribe({
                next: () => {
                    this.processStatus = 'success';

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Category updated',
                        detail: `The category ${category.name} has been successfully updated.`,
                        life: 2000
                    });

                    this.hideDialogForm();
                },
                error: (error: string) => {
                    this.processStatus = 'error';

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error updating category',
                        detail: error,
                        life: 2000
                    });
                }
            });
    }
}
