import { Component, inject, signal } from '@angular/core';
import { faArrowUp, faArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import { CategoryFormComponent } from '@features/categories/components/category-form/category-form.component';
import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { SharedModule } from '@shared/shared.module';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { ModalDialogComponent } from '@shared/components/modal-dialog/modal-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { InputFieldColorsWithIcon } from '@shared/models/control-colors.model';
import { ProcessStatus } from '@shared/models/process-status.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedModule, CategoryFormComponent, IconButtonComponent, LargeButtonComponent, ModalDialogComponent, PageTitleComponent],
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  categoryFormDialogMode = signal<'add' | 'update'>('add');
  categoryFormDialogTitle = signal<string>('Add New Category');
  categoryFormErrorMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  processStatus = signal<ProcessStatus>('init');
  selectedCategory = signal<Category | undefined>(undefined);
  showDialog = signal(false);
  showDeleted = signal(false);

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faSearch = faSearch;

  ngOnInit() {
    this.loadCategories();
  }

  get inputFieldColorsWithIcon(): string {
    return InputFieldColorsWithIcon;
  }

  loadCategories() {
    this.categoryService
      .getCategories(this.showDeleted())
      .subscribe({
        next: (categories: Category[]) => {
          this.categories.set(categories);
          this.errorMessage.set(null);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  onShowDeletedToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.showDeleted.set(checked);
    this.loadCategories();
  }

  openAddCategoryDialog(): void {
    this.categoryFormDialogMode.set('add');
    this.categoryFormDialogTitle.set('Add New Category');
    this.categoryFormErrorMessage.set(null);
    this.processStatus.set('init');
    this.selectedCategory.set(undefined);
    this.showDialog.set(true);
  }

  openEditCategoryDialog(category: Category): void {
    this.categoryFormDialogMode.set('update');
    this.categoryFormDialogTitle.set('Edit Category');
    this.categoryFormErrorMessage.set(null);
    this.processStatus.set('init');
    this.selectedCategory.set(category);
    this.showDialog.set(true);
  }

  onDialogClose(): void {
    this.showDialog.set(false);
  }

  onDialogSave(categoryData: CreateCategory | UpdateCategory): void {
    this.errorMessage.set(null);
    this.processStatus.set('loading');

    if (this.categoryFormDialogMode() === 'add') {
      this.createCategory(categoryData as CreateCategory);
    } else {
      const updateData: UpdateCategory = {
        ...categoryData,
        categoryId: this.selectedCategory()!.categoryId
      };
      this.updateCategory(updateData);
    }
  }

  private createCategory(category: CreateCategory): void {
    this.categoryService
      .createCategory(category)
      .subscribe({
        next: () => {
          this.onDialogClose();
          this.loadCategories();
          this.processStatus.set('success');
        },
        error: (error: string) => {
          this.categoryFormErrorMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }

  private updateCategory(category: UpdateCategory): void {
    this.categoryService
      .updateCategory(category)
      .subscribe({
        next: () => {
          this.onDialogClose();
          this.loadCategories();
          this.processStatus.set('success');
        },
        error: (error: string) => {
          this.categoryFormErrorMessage.set(error);
          this.processStatus.set('error');
        }
      });
  }
}
