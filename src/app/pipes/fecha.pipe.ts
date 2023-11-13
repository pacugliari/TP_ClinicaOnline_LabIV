import { Pipe, PipeTransform, LOCALE_ID } from '@angular/core';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const fecha = new Date(value);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    return formatDate(fecha, 'dd \'de\' MMMM', 'es');
  }

}
