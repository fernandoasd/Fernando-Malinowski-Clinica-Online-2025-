import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Turno } from '../interfaces/interfaces';

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

  async confirmarYEnviar(mensaje: any) {
    const result = await Swal.fire({
      title: '¿Confirmás la carga de datos?',
      html: `
        <p><strong>${mensaje}</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    });
    return result;
  }

  agregarDatoDinamico(){
      console.log("agregarDatoDinamico");
    }

  async enviarHC(turno: Turno, maxDatosDinamicos: number = 3) {
    const nombre = "Fernando";
    if (!turno.datos_dinamicos){
      turno.datos_dinamicos = [];
    }
    let htmlContent = `
    <button type="button" (click)="${this.agregarDatoDinamico()}"
                    [disabled]="${turno.datos_dinamicos} && ${turno.datos_dinamicos!.length} >= ${maxDatosDinamicos}">Agregar dato</button>
    <button type="submit">Guardar</button>
    `;
    turno.datos_dinamicos!.forEach((dato, i) => {
    htmlContent += `
    <div style="margin-bottom:10px;">
      <label>Nuevo dato ${i + 1}</label><br>
      <input id="clave-${i}" class="swal2-input" placeholder="Clave" />
      <input id="valor-${i}" class="swal2-input" placeholder="Valor" />
    </div>
  `;
    });
    return Swal.fire({
      title: 'Finalizar Turno.',
      html:
        `
<div class="d-flex flex-row justify-content-center">
    <div class="text-center p-2">
        <p><strong><u>Altura: </u></strong></p>
        <p><input id="input-altura" class="swal2-input border border-dark" placeholder="Altura"></p>
        <p><strong><u>Peso: </u></strong></p>
        <p><input id="input-peso" class="swal2-input border border-dark" placeholder="Peso"></p>
        <p><strong><u>Temperatura: </u></strong></p>
        <p><input id="input-temperatura" class="swal2-input border border-dark" placeholder="Temperatura"></p>
        <p><strong><u>Presión: </u></strong></p>
        <p><input id="input-presion" class="swal2-input border border-dark" placeholder="Presión"></p>
    </div>
    <div class="text-center p-2">
        <div *ngFor="let dato of datosDinamicos; let i = index">
                    <label for="nuevo">Nuevo dato {{i+1}}</label>
                    <input type="text" name="clave{{i}}" placeholder="Clave" [(ngModel)]="dato.clave" required>
                    <input type="text" name="valor{{i}}" placeholder="Valor" [(ngModel)]="dato.valor" required>
        </div>

                <button type="button" (click)="agregarDatoDinamico()"
                    [disabled]="historiaClinica.datosDinamicos.length >= maxDatosDinamicos">Agregar dato</button>
                <button type="submit">Guardar</button>
    </div>
</div>
        `,
      focusConfirm: false,
      showCancelButton: true,
      draggable: true,
      confirmButtonText: 'Guardar',
      width: "80vw",
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

  custom() {
    Swal.fire({
      title: 'Modal grande',
      text: 'Este es un modal con tamaño grande.',
      icon: 'info',
      width: '80vw'
    });
  }




}
