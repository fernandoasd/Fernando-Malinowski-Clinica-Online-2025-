import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }


  async enviarResenia() {
    return Swal.fire({
      title: 'Completar información',
      html:
        '<input id="input-resena" class="swal2-input" placeholder="Reseña">' +
        '<input id="input-diagnostico" class="swal2-input" placeholder="Diagnóstico">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const resenia = (document.getElementById('input-resena') as HTMLInputElement).value;
        const diagnostico = (document.getElementById('input-diagnostico') as HTMLInputElement).value;

        if (!resenia || !diagnostico) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
          return;
        }

        return { resenia, diagnostico };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        console.log('Reseña:', result.value.resenia);
        console.log('Diagnóstico:', result.value.diagnostico);

        // podés guardar los datos o usarlos como necesites
        return [result.value.resenia, result.value.diagnostico] ;
      }
      return [] ;
    });
  }
}
