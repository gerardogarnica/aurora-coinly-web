import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { Category, CreateCategory, UpdateCategory } from '@features/categories/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/categories';

  getCategory(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Category>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getCategories(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;
    return this.httpClient.get<Category[]>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  createCategory(category: CreateCategory) {
    return this.httpClient.post<string>(this.apiUrl, category, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  updateCategory(category: UpdateCategory) {
    let url = `${this.apiUrl}/${category.categoryId}`;
    return this.httpClient.put(url, category, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  deleteCategory(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
