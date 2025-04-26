import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Category } from '@features/categories/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = '/aurora/coinly/categories';

  getCategories(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;

    return this.httpClient.get<Category[]>(url);
  }
}
