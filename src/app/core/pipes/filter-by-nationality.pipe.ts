import { Pipe, PipeTransform } from '@angular/core';
import { ISeafarer } from '../interfaces/iseafarer';

@Pipe({
  name: 'filterByNationality',
  standalone: true
})
export class FilterByNationalityPipe implements PipeTransform {

  transform(data: ISeafarer[], value: string): ISeafarer[] {
    if(!data) return [];
    if(!value) return data;
    let newArr: ISeafarer[];
    newArr = data.filter(s => s.Nationality.toUpperCase().includes(value.toUpperCase()));
    return newArr;
  }

}
