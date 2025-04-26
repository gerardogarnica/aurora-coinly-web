import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = '/aurora/coinly/categories';

  getCategory(id: string) {
    let url = `${this.apiUrl}/${id}`;

    return this.httpClient.get<Category>(url);
  }

  getCategories(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;

    return this.httpClient.get<Category[]>(url);
  }

  createCategory(category: CreateCategory) {
    return this.httpClient.post<string>(this.apiUrl, category);
  }

  updateCategory(category: UpdateCategory) {
    let url = `${this.apiUrl}/${category.categoryId}`;

    return this.httpClient.put(url, category);
  }

  deleteCategory(id: string) {
    let url = `${this.apiUrl}/${id}`;

    return this.httpClient.delete(url);
  }
}
