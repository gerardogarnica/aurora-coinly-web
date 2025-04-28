import { Component, inject, signal } from '@angular/core';
import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { SharedModule } from '@shared/shared.module';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);
  errorMessage = signal<string | null>(null);
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategories(false).subscribe({
      next: (categories: Category[]) => {
        this.categories.set(categories);
        this.errorMessage.set(null);
      },
      error: (error: string) => {
        this.errorMessage.set(error);
      }
    });
  }
}
