import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turnosPipe'
})
export class TurnosPipe implements PipeTransform {

  transform<T>(items: T[], valorBuscado: string, campos: (keyof T)[] = []): T[] {
    if (!items) return [];
    if (!valorBuscado) return items;

    valorBuscado = valorBuscado.toLowerCase();

    return items.filter(item => {
      return campos.some(campo => {
        const valor: any = item[campo];

        if (campo === 'datos_dinamicos' && Array.isArray(valor)) {
          return valor.some(datoDinamico => {
            return datoDinamico.clave.toLowerCase().includes(valorBuscado) || datoDinamico.valor.toLowerCase().includes(valorBuscado);
          });
        } else if (campo === "especialistas") {
          console.log("valor ", valor);
          return valor.nombre.toLowerCase().includes(valorBuscado) || valor.apellido.toLowerCase().includes(valorBuscado)
        } else if (campo === "pacientes") { 
          return valor.nombre.toLowerCase().includes(valorBuscado) || valor.apellido.toLowerCase().includes(valorBuscado)
        }

        return valor && valor.toString().toLowerCase().includes(valorBuscado);
      });
    });
  }

}
