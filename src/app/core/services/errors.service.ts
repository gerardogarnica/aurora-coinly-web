import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor() { }

  handleHttpError(error: HttpErrorResponse): string {
    const errorMessageText = error.error.detail;

    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred:', errorMessageText);
      return 'A network error occurred. Please check your connection.';
    }

    // Backend returned an unsuccessful response code
    console.error(
      `Backend returned code ${error.status}, ${error.error.detail}, body was: `, error.error, error.error.errors
    );

    // Customize messages based on status or error content
    if (error.status === 0) {
      return 'Unable to connect to the server. Please try again later.';
    }
    if (error.status === HttpStatusCode.NotFound) {
      return 'The requested resource was not found.';
    }
    if (error.status === HttpStatusCode.Unauthorized) {
      return 'You are not authorized to perform this action.';
    }
    if (error.status === HttpStatusCode.BadRequest || error.status === HttpStatusCode.InternalServerError) {
      return errorMessageText;
    }

    // Default message
    return 'An unexpected error occurred. Please try again.';
  }
}
