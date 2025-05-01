import { Component, inject, signal } from '@angular/core';
import { faArrowUp, faArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import { CategoryDetailDialogComponent } from '@features/categories/components/category-detail-dialog/category-detail-dialog.component';
import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { SharedModule } from '@shared/shared.module';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { LargeButtonComponent } from '@shared/components/large-button/large-button.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedModule, PageTitleComponent, CategoryDetailDialogComponent, IconButtonComponent, LargeButtonComponent],
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);
  errorMessage = signal<string | null>(null);
  showDialog = signal(false);
  selectedCategory = signal<Category | undefined>(undefined);
  dialogMode = signal<'add' | 'update'>('add');

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faSearch = faSearch;

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategories(false)
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

  openAddCategoryDialog(): void {
    this.dialogMode.set('add');
    this.selectedCategory.set(undefined);
    this.showDialog.set(true);
  }

  openEditCategoryDialog(category: Category): void {
    this.dialogMode.set('update');
    this.selectedCategory.set(category);
    this.showDialog.set(true);
  }

  onDialogClose(): void {
    this.showDialog.set(false);
  }

  onDialogSave(categoryData: CreateCategory | UpdateCategory): void {
    if (this.dialogMode() === 'add') {
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
          this.getCategories();
          this.errorMessage.set(null);
          this.showDialog.set(false);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }

  private updateCategory(category: UpdateCategory): void {
    this.categoryService
      .updateCategory(category)
      .subscribe({
        next: () => {
          this.getCategories();
          this.errorMessage.set(null);
          this.showDialog.set(false);
        },
        error: (error: string) => {
          this.errorMessage.set(error);
        }
      });
  }
}
