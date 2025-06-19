import { Component, inject, signal, ViewChild } from '@angular/core';

import { CategoryFormComponent } from '@features/categories/components/category-form.component';
import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { TransactionType } from '@features/transactions/models/transaction.types';
import { PageHeaderComponent } from '@shared/components/page-header.component';
import { PageTitleComponent } from '@shared/components/page-title.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoryFormComponent, PageHeaderComponent, PageTitleComponent, ButtonModule, ConfirmDialog, IconFieldModule, InputIconModule, InputText, TableModule, TagModule, ToastModule, ToggleSwitchModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  @ViewChild('dt') dt!: Table;

  categoryService = inject(CategoryService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  categories = signal<Category[]>([]);
  errorMessage = signal<string | null>(null);
  selectedCategory = signal<Category | undefined>(undefined);
  showDeleted = signal(false);

  showDialog = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getCategories(this.showDeleted())
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  onSearch(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    dt.filterGlobal(input.value, 'contains');
  }

  onShowInactiveChange(event: any) {
    this.showDeleted.set(event.checked);
    this.loadCategories();
  }

  getTypeIcon(type: TransactionType): string {
    switch (type) {
      case TransactionType.Expense:
        return 'pi pi-arrow-down';
      case TransactionType.Income:
        return 'pi pi-arrow-up';
      default:
        return 'pi pi-info-circle';
    }
  }

  getTypeSeverity(type: TransactionType): string {
    switch (type) {
      case TransactionType.Expense:
        return 'danger';
      case TransactionType.Income:
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusSeverity(isDeleted: boolean): string {
    return isDeleted ? 'danger' : 'success';
  }

  onAddCategory() {
    this.selectedCategory.set(undefined);
    this.showDialog = true;
  }

  onEditCategory(category: Category) {
    this.selectedCategory.set(category);
    this.showDialog = true;
  }

  onDeleteCategory(category: Category) {
    this.selectedCategory.set(category);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + category.name + '?',
      header: 'Delete category',
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        icon: 'pi pi-times',
        size: 'small'
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        icon: 'pi pi-trash',
        size: 'small'
      },
      accept: () => {
        this.categoryService
          .deleteCategory(category.categoryId)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Category deleted',
                detail: `The category ${category.name} has been successfully deleted.`,
                life: 2000
              });

              this.loadCategories();
            },
            error: (error: string) =>{
              this.messageService.add({
                severity: 'error',
                summary: 'Error deleting category',
                detail: error,
                life: 2000
              });
            }
          });
      }
    });
  }

  onCategoryFormDialogClose() {
    this.showDialog = false;
    this.loadCategories();
  }
}
