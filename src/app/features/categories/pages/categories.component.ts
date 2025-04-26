import { Component, inject, signal } from '@angular/core';
import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategories(false).subscribe({
      next: (categories: Category[]) => {
        this.categories.set(categories);
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
} 