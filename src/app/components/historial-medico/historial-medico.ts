import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Turno } from '../../interfaces/interfaces';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-historial-medico',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './historial-medico.html',
  styleUrl: './historial-medico.css'
})
export class HistorialMedico {
  turnoInput = input<Turno>();
  puedeEditarInput = input<boolean>(false);
  modificarHCEvent = output<Turno>();
  private formBuilder = inject(FormBuilder);
  maxDatosDinamicos = 3;


  formularioHC = this.formBuilder.group({
    altura: [this.turnoInput()?.altura ?? 0, [Validators.required]],
    peso: [this.turnoInput()?.peso ?? 0, [Validators.required]],
    temperatura: [this.turnoInput()?.temperatura ?? 0, [Validators.required]],
    presion: [this.turnoInput()?.presion ?? 0, [Validators.required]],
    datosDinamicos: this.formBuilder.array([]),
  });

  ngOnInit() {
    if (this.turnoInput()?.datos_dinamicos) {
      this.turnoInput()?.datos_dinamicos?.forEach(obj => {
        this.agregarDatoDinamico(obj.clave, obj.valor);
      })
    } else {
      console.log("sin datos dinamicos");
    }

    this.getControl("altura").setValue(this.turnoInput()?.altura ?? null);
    this.getControl("peso").setValue(this.turnoInput()?.peso ?? null);
    this.getControl("temperatura").setValue(this.turnoInput()?.temperatura ?? null);
    this.getControl("presion").setValue(this.turnoInput()?.presion ?? null);



    console.log(this.formularioHC.value);
    console.log("datos din: ", this.datosDinamicos.length);
  }

  get datosDinamicos(): FormArray {
    return this.formularioHC.get('datosDinamicos') as FormArray;
  }

  crearDatoDinamico(c: string, v: string): FormGroup {
    return this.formBuilder.group({
      clave: [c, [Validators.required, Validators.minLength(3)]],
      valor: [v, [Validators.required]]
    });
  }

  getControl(campo: string) {
    return this.formularioHC.get(campo)!;
  }

  agregarDatoDinamico(clave: string = "", valor: string = "") {
    this.datosDinamicos.push(this.crearDatoDinamico(clave, valor));
  }

  eliminarDatoDinamico(index: number) {
    this.datosDinamicos.removeAt(index);
  }

  enviarFormulario() {
    this.formularioHC.markAllAsTouched();
    if (this.formularioHC.valid) {
      let turnoRetorno = { ...this.turnoInput() }
      turnoRetorno.altura = this.formularioHC.get("altura")?.value;
      turnoRetorno.peso = this.formularioHC.get("peso")?.value;
      turnoRetorno.temperatura = this.formularioHC.get("temperatura")?.value;
      turnoRetorno.presion = this.formularioHC.get("presion")?.value;
      turnoRetorno.datos_dinamicos = [];
      for (let control of this.datosDinamicos.controls){
        turnoRetorno.datos_dinamicos?.push({clave: control.get('clave')?.value, valor: control.get('valor')?.value});
      }

      this.modificarHCEvent.emit(turnoRetorno);
      console.log("this.formularioHC.value ", this.formularioHC.value);
      console.log("turnoRetorno ", turnoRetorno);
    } else {
      console.log("no es valido!");
    }
  }

  emitirTurnoModificado() {

  }

  initDatosDinamicos() {
    if (this.turnoInput()?.datos_dinamicos != undefined) {
      if (this.turnoInput()!.datos_dinamicos!.length < this.maxDatosDinamicos) {
        this.turnoInput()!.datos_dinamicos!.push({ clave: '', valor: '' });
      }
    } else {
      this.turnoInput()?.datos_dinamicos?.push({ clave: '', valor: '' });
    }
  }


  // datosDinamicos = [
  //   { clave: "caries", valor: 2 },
  //   { clave: "huesos", valor: 200 },
  //   { clave: "pelos", valor: 2 },
  // ]


  // cargarDatosDinamicos() {
  //   const nuevoControl = new FormControl('Dynamic Value', Validators.minLength(5));

  //   // Agrega el control al FormGroup con una clave, por ejemplo: "datoExtra1"
  //   this.datosDinamicos.forEach(dato => {
  //     this.formulario.addControl(dato.clave, new FormControl(dato.valor, Validators.required));
  //   });
  // }


  // agregarDatoDinamico() {
  //   if (this.turnoInput()?.datos_dinamicos != undefined) {
  //     if (this.turnoInput()!.datos_dinamicos!.length < this.maxDatosDinamicos) {
  //       this.turnoInput()!.datos_dinamicos!.push({ clave: '', valor: '' });
  //     }
  //   } else {
  //     this.turnoInput()?.datos_dinamicos?.push({ clave: '', valor: '' });
  //   }
  // }




}
