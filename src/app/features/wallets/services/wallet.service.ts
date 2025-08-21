import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { checkToken } from '@core/interceptors/auth.interceptor';
import { ErrorsService } from '@core/services/errors.service';
import { Wallet, CreateWallet, UpdateWallet, AssignToAvailableWalletRequest, AssignToSavingsWalletRequest, TransferBetweenWalletsRequest } from '@features/wallets/models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly httpClient = inject(HttpClient);
  private readonly errorsService = inject(ErrorsService);
  private readonly apiUrl = '/aurora/coinly/wallets';

  getWallet(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Wallet>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getWalletHistory(id: string, dateFrom: Date, dateTo: Date) {
    let url = `${this.apiUrl}/${id}/history?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    return this.httpClient.get<Wallet>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  getWallets(showDeleted: boolean) {
    let url = `${this.apiUrl}?deleted=${showDeleted}`;
    return this.httpClient.get<Wallet[]>(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  createWallet(wallet: CreateWallet) {
    return this.httpClient.post<string>(this.apiUrl, wallet, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  updateWallet(wallet: UpdateWallet) {
    let url = `${this.apiUrl}/${wallet.walletId}`;
    return this.httpClient.put(url, wallet, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  deleteWallet(id: string) {
    let url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  assignToAvailableWallet(request: AssignToAvailableWalletRequest) {
    let url = `${this.apiUrl}/${request.walletId}/assign/available`;
    return this.httpClient.put(url, request, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  assignToSavingsWallet(request: AssignToSavingsWalletRequest) {
    let url = `${this.apiUrl}/${request.walletId}/assign/savings`;
    return this.httpClient.put(url, request, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }

  transferBetweenWallets(request: TransferBetweenWalletsRequest) {
    let url = `${this.apiUrl}/transfer`;
    return this.httpClient.post(url, request, { context: checkToken() }).pipe(
      catchError(error => throwError(() => this.errorsService.handleHttpError(error)))
    );
  }
}
