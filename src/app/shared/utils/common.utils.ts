import { CurrencyPipe } from '@angular/common';
import { CategoryGroup } from '@features/categories/models/category.model';

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

  /**
   * Obtiene el ícono asociado a un grupo de categorías.
   * @param group El grupo de categorías.
   * @returns El nombre del ícono correspondiente.
   */
  static getGroupIcon(group: CategoryGroup): string {
    switch (group) {
      case CategoryGroup.Clothing:
        return 'pi pi-shopping-bag';
      case CategoryGroup.Education:
        return 'pi pi-book';
      case CategoryGroup.Entertainment:
        return 'pi pi-video';
      case CategoryGroup.Finances:
        return 'pi pi-dollar';
      case CategoryGroup.FoodAndDining:
        return 'pi pi-bell';
      case CategoryGroup.Groceries:
        return 'pi pi-shopping-cart';
      case CategoryGroup.Health:
        return 'pi pi-heart-fill';
      case CategoryGroup.Housing:
        return 'pi pi-home';
      case CategoryGroup.Income:
        return 'pi pi-money-bill';
      case CategoryGroup.Insurance:
        return 'pi pi-shield';
      case CategoryGroup.Miscellaneous:
        return 'pi pi-asterisk';
      case CategoryGroup.Other:
        return 'pi pi-tags';
      case CategoryGroup.PersonalCare:
        return 'pi pi-user';
      case CategoryGroup.Pets:
        return 'pi pi-pause';
      case CategoryGroup.Savings:
        return 'pi pi-building-columns';
      case CategoryGroup.Subscriptions:
        return 'pi pi-sync';
      case CategoryGroup.Transportation:
        return 'pi pi-truck';
      case CategoryGroup.Travel:
        return 'pi pi-map-marker';
      case CategoryGroup.Utilities:
        return 'pi pi-lightbulb';
      case CategoryGroup.Vehicle:
        return 'pi pi-car';
      default:
        return 'pi pi-tags';
    }
  }
}
