import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { Disponibilidad, Especialista, Paciente, Usuario } from '../../interfaces/interfaces';
import { DiaSemana, Perfil } from '../../enums/enums';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  us = inject(UsuarioService);
  usuario: any;
  especialista: Especialista = {}
  form!: FormGroup;
  espSelect = "";
  especialidades = ['Medico', 'Traumatologo', 'Cardiologo'];
  miDisponibilidad: Disponibilidad[] = [];

 

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  disponibilidad = [
    { especialidad: 'Medico', dia_semana: 'lunes', horario_inicio: '08:00', horario_fin: '12:00' },
    { especialidad: 'Medico', dia_semana: 'martes', horario_inicio: '10:00', horario_fin: '14:00' },
    { especialidad: 'Traumatologo', dia_semana: 'miércoles', horario_inicio: '09:00', horario_fin: '13:00' },
    { especialidad: 'Cardiologo', dia_semana: 'viernes', horario_inicio: '15:00', horario_fin: '18:00' },
  ];

  disp: Disponibilidad = {
    id_especialista: 5,
    especialidad: "cardiología",
    duracion_turno: 30,
    horarios: [
      {
        dia_semana: DiaSemana.Lunes,
        horario_inicio: "08:00",
        horario_fin: "12:00"
      },
      {
        dia_semana: DiaSemana.Miercoles,
        horario_inicio: "14:00",
        horario_fin: "18:00"
      },
      {
        dia_semana: DiaSemana.Viernes,
        horario_inicio: "10:00",
        horario_fin: "13:00"
      }
    ]
  };

  disponibilidadFiltrada: Disponibilidad= {};

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      especialidad: ['']
    });

    console.log("this.form.controls", this.form.controls);
  }

  ngOnInit() {
    if (this.us.usuarioActual!.perfil === Perfil.Especialista) {
      this.us.traerEspecialistaUsuarioId(this.us.usuarioActual!.id_usuario!).then(({ data, error }) => {
        if (error == null && data?.length! > 0) {
          this.usuario = data![0];
          console.log("this.usuario", this.usuario);
          this.us.traerDisponibilidad(this.usuario.id_especialista).then(({ data, error }) => {
            if (error == null && data?.length! > 0) {
              this.miDisponibilidad = data!;
              console.log("this.miDisponibilidad", this.miDisponibilidad);
            }
          })
        }
      })

    } else if (this.us.usuarioActual!.perfil === Perfil.Paciente) {
      this.us.traerPacienteUsuarioId(this.us.usuarioActual!.id_usuario!).then(({ data, error }) => {
        if (error == null && data?.length! > 0) {
          this.usuario = data![0];
          console.log("mi perfil: ", this.usuario);
        }
      });
    }
  }

  async traerDatos(usuario: Usuario) {
    let usuarioRetorno: any;
    let disponibilidadRetorno: any;
    if (usuario.perfil === Perfil.Especialista) {

      this.us.traerEspecialistaUsuarioId(usuario.id_usuario!).then(({ data, error }) => {
        if (error == null && data?.length! > 0) {
          usuarioRetorno = data![0];
          console.log("usuarioRetorno", usuarioRetorno);
          this.us.traerDisponibilidad(usuarioRetorno.id_especialista).then(({ data, error }) => {
            if (error == null && data?.length! > 0) {
              console.log("disponibilidadRetorno data", data);
              disponibilidadRetorno = data;
            }
          })
        }
        console.log("disponibilidadRetorno", disponibilidadRetorno);
        return { usuarioRetorno, disponibilidadRetorno };
      });

    } else if (usuario.perfil === Perfil.Paciente) {
      this.us.traerPacienteUsuarioId(usuario.id_usuario!).then(({ data, error }) => {
        if (error == null && data?.length! > 0) {
          usuarioRetorno = data![0];
        }
      });
      return { usuarioRetorno, disponibilidadRetorno };
    }
    return { usuarioRetorno, disponibilidadRetorno };
  }



  get dias(): FormArray {
    return this.form.get('dias') as FormArray;
  }

  nombreDia(index: number): string {
    return this.diasSemana[index];
  }

  toggleDia(index: number) {
    const grupo = this.dias.at(index) as FormGroup;
    if (!grupo.get('activo')?.value) {
      grupo.patchValue({ horario_inicio: '', horario_fin: '' });
    }
  }

  guardarDisponibilidad() {
    const diasActivos = this.form.value.dias
      .map((d: any, i: number) => ({
        dia_semana: this.diasSemana[i],
        horario_inicio: d.horario_inicio,
        horario_fin: d.horario_fin,
        activo: d.activo
      }))
      .filter((d: any) => d.activo)
      .map((d: any)=> ({
        dia_semana: d.dia_semana,
        horario_inicio: d.horario_inicio,
        horario_fin: d.horario_fin,
      }));

    const errores: string[] = [];
    console.log("this.form.value.dias ",this.form.value.dias);
    for (let dia of diasActivos) {
      console.log("dia: ", dia);
      const inicio = dia.horario_inicio;
      const fin = dia.horario_fin;

      if (!inicio || !fin || inicio >= fin) {
        errores.push(`Horario inválido en ${dia.dia_semana}`);
        continue;
      }

      // Validaciones por día
      if (dia.dia_semana === 'sábado') {
        if (inicio < '08:00' || fin > '14:00') {
          errores.push(`En sábado debe estar entre 08:00 y 14:00`);
        }
      } else {
        if (inicio < '08:00' || fin > '19:00') {
          errores.push(`En ${dia.dia_semana} debe estar entre 08:00 y 19:00`);
        }
      }
    }

    if (errores.length > 0) {
      Swal.fire("Error", "Errores:\n" + errores.join('\n'), "error")
      return;
    }

    console.log('Días válidos:', diasActivos);
    // guardar en Supabase aquí
  }

  cargarDisponibilidad(especialidad: string) {
    let disponibilidadFiltrada = this.miDisponibilidad.filter(d => d.especialidad === especialidad);
    console.log("this.disponibilidadFiltrada ", disponibilidadFiltrada);
    return disponibilidadFiltrada[0];
  }

  modificarEspecialidad(event: Event) {
    if (this.espSelect == "") {
      const valor = (event.target as HTMLSelectElement).textContent;
      this.espSelect = valor!;
      this.form.get('especialidad')?.setValue(valor);
      console.log('Seleccionar:', this.espSelect);
      this.disponibilidadFiltrada = this.cargarDisponibilidad(this.espSelect)
      this.cargarFormulario(this.espSelect, this.disponibilidadFiltrada);
      console.log('this.form: ', this.form.controls);
    } else {
      this.espSelect = "";
    }
  }

  cargarFormulario(especialidad: string, disponibilidadFiltrada: Disponibilidad){
        this.form = this.fb.group({
      dias: this.fb.array(this.diasSemana.map((dia) => this.fb.group({
        dia_semana: [dia],
        activo: [disponibilidadFiltrada.horarios?.some(horario => horario.dia_semana === dia)],
        horario_inicio: [disponibilidadFiltrada.horarios?.find((horario) => horario.dia_semana == dia)?.horario_inicio || ""],
        horario_fin: [disponibilidadFiltrada.horarios?.find((horario) => horario.dia_semana == dia)?.horario_fin || ""]
      })))
    });

    this.form.addControl('especialidad', this.fb.control(especialidad));
    this.form.addControl('duracion_turno', this.fb.control(disponibilidadFiltrada.duracion_turno));
  }



  
  //   usuario = {
  //   nombre: 'Juan',
  //   apellido: 'Pérez',
  //   tipo_perfil: 'Administrador',
  //   email: 'juan.perez@example.com',
  //   telefono: '123-456-7890',
  //   direccion: 'Calle Falsa 123',
  //   foto: 'assets/perfil.jpg' // o una URL externa
  // };
}
