import { CurrencyPipe } from '@angular/common';

export class CommonUtils {

  /**
   * Obtiene la fecha del día actual, sin hora.
   * @returns La fecha del día actual.
   */
  static currentDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  /**
   * Formatea un número como moneda.
   * @param amount El monto a formatear.
   * @param currencyCode Código de moneda (ej: 'USD', 'MXN').
   * @param currencyPipe Instancia de CurrencyPipe (inyectada en el componente).
   * @returns El monto formateado como string.
   */
  static formatAmount(
    amount: number,
    currencyCode: string = 'USD',
    currencyPipe: CurrencyPipe,
    digits: string = '1.2-2'): string {
    return currencyPipe.transform(
      amount,
      currencyCode,
      'symbol',
      digits
    ) || '';
  }
}
