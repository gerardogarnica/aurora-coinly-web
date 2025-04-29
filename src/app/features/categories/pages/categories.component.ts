import { Component, inject, signal } from '@angular/core';
import { faArrowUp, faArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Category } from '@features/categories/models/category.model';
import { CategoryService } from '@features/categories/services/category.service';
import { SharedModule } from '@shared/shared.module';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedModule, PageTitleComponent],
  templateUrl: './categories.component.html'
})
export default class CategoriesComponent {
  private readonly categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);
  errorMessage = signal<string | null>(null);

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faSearch = faSearch;

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
