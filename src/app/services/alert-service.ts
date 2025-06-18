import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }


  async enviarResenia() {
    return Swal.fire({
      title: 'Finalizar Turno.',
      html:
        `
        <div class="text-center">
        <p"><strong><u>Diagnóstico: </u></strong></p> <p><input id="input-diagnostico" class="swal2-input border border-dark" placeholder="Diagnóstico"></p>
        <p><strong><u>Reseña: </u></strong></p> <p><input id="input-resena" class="swal2-input border border-dark" placeholder="Reseña"></p>
        </div">
        `,
      focusConfirm: false,
      showCancelButton: true,
      draggable: true,
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
        return [result.value.resenia, result.value.diagnostico];
      }
      return [];
    });
  }

  leerResenia(resenia: string, diagnostico: string) {
    Swal.fire({
      title: "Reseña del turno.",
      draggable: true,
      html: `
        <div class="text-center">
            <p><b><u>Diagnóstico:</u></b> ${diagnostico}.</p>
            <p><b><u>Resenia:</u></b> ${resenia}.</p> 
        </div>
      `,
    });
  }
}
