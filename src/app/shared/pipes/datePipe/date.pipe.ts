import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any): any {
    if (!value) {
      return value;
    }
    const trueFormat = new Date(value).toISOString().split('T');

    return `${trueFormat[0].split('-')[2]}/${trueFormat[0].split('-')[1]}/${trueFormat[0].split('-')[0]}`;
  }

}
