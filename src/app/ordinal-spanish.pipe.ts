import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalSpanish'
})
export class OrdinalSpanishPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return '0º';
    }

    if (value % 100 >= 11 && value % 100 <= 13) {
      return value + 'º';
    }

    switch (value % 10) {
      case 1:
        return value + 'º';
      case 2:
        return value + 'º';
      case 3:
        return value + 'º';
      case 4:
        return value + 'º';
      default:
        return value + 'º';
    }
  }

}
