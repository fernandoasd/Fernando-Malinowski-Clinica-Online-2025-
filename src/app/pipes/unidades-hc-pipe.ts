import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unidadesHc'
})
export class UnidadesHcPipe implements PipeTransform {

  transform(valor: number | string | null | undefined, tipo: string): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    tipo = tipo.toLowerCase();
    if (valor !== "") {
      switch (tipo) {
        case 'altura':
          return `${valor} cm`;
        case 'peso':
          return `${valor} Kg`;
        case 'temperatura':
          return `${valor} °C`;
        case 'presion':
          return `${valor} mmHg`;
        default:
          return `${valor} unidades`;
      }
    } else {
      switch (tipo) {
        case 'altura':
          return ` (cm)`;
        case 'peso':
          return ` (Kg)`;
        case 'temperatura':
          return ` (°C)`;
        case 'presion':
          return ` (mmHg)`;
        default:
          return ` unidades`;
      }
    }

  }
}
