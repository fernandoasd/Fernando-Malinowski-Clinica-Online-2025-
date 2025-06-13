import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialistaPipe'
})
export class EspecialistaPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
