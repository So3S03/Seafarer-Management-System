import { Pipe, PipeTransform } from '@angular/core';
import { ISeafarer } from '../interfaces/iseafarer';

@Pipe({
  name: 'filterByName',
  standalone: true
})
export class FilterByNamePipe implements PipeTransform {

  transform(data: ISeafarer[], value: string): ISeafarer[] {
    if(!data) return [];
    if(!value) return data;
    let newArr: ISeafarer[];
    newArr = data.filter(s => s.EmployeeName.toUpperCase().includes(value.toUpperCase()));
    return newArr;
  }

}
