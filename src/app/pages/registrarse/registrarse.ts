import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { UsuarioService } from '../../services/UsuarioService';
import Swal from 'sweetalert2';
import { Especialista, Paciente, Usuario } from '../../interfaces/interfaces';
import { Perfil } from '../../enums/enums';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-registrarse',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrarse.html',
  styleUrl: './registrarse.css',
})
export class Registrarse {
  auth = inject(AuthService);
  us = inject(UsuarioService);
  data: any[] | null = null;
  error = signal<string>("");

  mail: string = "";
  contrasenia: string = "";
  nombre: string = "";
  apellido: string = "";
  edad: number = 0;
  dni: string = "";
  perfil = signal<Perfil>(Perfil.Anonimo);
  obra_social: string = "";
  imagen_uno: string = "";
  imagen_dos: string = "";
  especialidad: string = "";
  nuevaEspecialidad: string = "";
  especialidades: string[] = ["cirujano", "cartonero"];
  activo: boolean = true;
  hayError: boolean = false;
  mailEjemplo = "ejemplo@gmail.com";
  mensajeErrorEspecialidad = "";

  opcionSeleccionada: string = "otro";
  otraOpcion: string = '';

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;


  formulario = new FormGroup({
    nombre: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    apellido: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    obra_social: new FormControl("---", {
      validators: [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.required],
    }),
    dni: new FormControl("38000000", {
      validators: [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.required],
    }),
    cuit: new FormControl("20-12345678-4", {
      validators: [
        // Validators.required,
        // Validators.pattern(/^[\d]{2}-?[\d]{8}-?[\d]{1}$/),
      ]

    }),
    mail: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+\w{2,4}$/)],
    }),
    contrasenia: new FormControl("123456", {
      validators: [
        Validators.required,
        Validators.pattern(/^\w{6,12}$/)
      ]
    }),
    perfil: new FormControl(Perfil.Paciente, {
      validators: [
        Validators.required,
      ]
    }),
    especialidad: new FormControl("---", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]
    }),
    nuevaEspecialidad: new FormControl("---", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]
    }),
    edad: new FormControl("20", {
      validators: [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(18),
        Validators.max(99)
      ]
    })
  })

  ngOninit() {
    // this.formulario.valueChanges.subscribe((value) => {
    //   console.log(value);
    // }) 
    this.formulario.statusChanges.subscribe((value) => {
      console.log(value);
      console.log(this.formulario);
    })
  }

  onSeleccionar(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    console.log('Seleccionaste:', valor);
    if (valor != "otra") {
      this.especialidades.push(valor);
      console.log('especialidades:', this.especialidades);
    }
  }

  onPerfil(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    console.log('Perfil:', valor);

    if (valor == "paciente") {
      this.formulario.get('especialidad')?.clearValidators();
      this.formulario.get('especialidad')?.updateValueAndValidity();

      this.formulario.get('nuevaEspecialidad')?.clearValidators();
      this.formulario.get('nuevaEspecialidad')?.updateValueAndValidity();

      console.log("validacion", this.formulario)
      console.log('Desactivado!');
    } else if (valor == "especialista") {
      this.formulario.get('especialidad')?.setValidators([Validators.required, Validators.email]);
      this.formulario.get('especialidad')?.updateValueAndValidity();

      this.formulario.get('nuevaEspecialidad')?.clearValidators;
      this.formulario.get('nuevaEspecialidad')?.updateValueAndValidity();
      console.log('Activado!');
    }
  }

  agregarEspecialidad(especialidad: string) {
    this.mensajeErrorEspecialidad = "";
    especialidad = especialidad.toLowerCase();
    this.formulario.get("nuevaEspecialidad")?.markAllAsTouched;
    if (especialidad.length >= 3 && especialidad.length <= 15) {
      if (this.especialidades.includes(especialidad)) {
        this.mensajeErrorEspecialidad = "Ya existe especialidad";
        Swal.fire("Validacion", "Ya existe especialidad", 'question');
      } else {
        this.especialidades.push(especialidad);
      }
    } else {
      Swal.fire("Validacion", "especialidad tiene que tener entre 3 y 15 caracteres.", 'question');

    }
  }

  eliminarEspecificacion(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    console.log('Eliminar:', valor);
    const index = this.especialidades.indexOf(valor);
    if (index !== -1) {
      this.especialidades.splice(index, 1);
    }
  }

  revisar() {
    this.formulario?.markAllAsTouched();
    console.log(this.formulario);
  }

  enviar() {
    console.log("perfil ", this.perfil());
    if (this.formulario.valid) {
      console.log("Se puede enviar");

      Swal.fire({
        title: "Crear cuenta??",
        showDenyButton: true,
        icon: 'question',
        confirmButtonText: "Crear",
        denyButtonText: `Salir`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.registrarse(this.perfil());
        }
      });

    } else {
      this.formulario?.markAllAsTouched();
      console.log("No se puede enviar");
      Swal.fire({
        icon: 'warning',
        title: "Error",
        text: "compruebe los campos requeridos",
        draggable: true
      });
    }
  }

  async registrarse(perfil: Perfil) {
    const respuesta = await this.auth.crearCuenta(this.mail, this.contrasenia);
    if (respuesta.error === null) {

      let nuevoUsuario: Usuario = {
        mail: this.mail.toLowerCase(),
        contrasenia: this.contrasenia,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        documento: this.dni,
        perfil: perfil,
        imagen_uno: this.imagen_uno,
      };

      await this.us.cargarUsuario(nuevoUsuario).then(({ data, error }) => {
        if (error == null) {
          if (data && data.length > 0) {
            nuevoUsuario.id_usuario = data[0]!.id_usuario;
            console.log("nuevoUsuario :", nuevoUsuario);
            console.log("perfil :", perfil);

            if (perfil === Perfil.Paciente) {
              console.log("paciente...");
              let nuevoPaciente = { ...nuevoUsuario, obra_social: this.obra_social, imagen_dos: this.imagen_dos } as unknown as Paciente;
              this.us.cargarPaciente(nuevoPaciente);
            } else if (perfil === Perfil.Especialista) {
              console.log("especialista...");
              let nuevoEspecialista = { ...nuevoUsuario, especialidades: this.especialidades } as unknown as Especialista;
              this.us.cargarEspecialista(nuevoEspecialista);
            }
          } else {
            console.log("registro datos vacios");
          };
        }
      });

      // if (perfil === Perfil.Paciente) {
      //   let nuevoPaciente = { ...nuevoUsuario, obra_social: this.obra_social, imagenDos: this.imagen_dos } as unknown as Paciente;
      //   this.us.cargarPaciente(nuevoPaciente);
      // }




      Swal.fire("Cuenta creada, bienvenido " + this.nombre, "", 'success');
    } else {

      // this.error.set(respuesta.error);
      this.hayError = true;
      switch (respuesta.error?.status) {
        case 400:
          this.error.set("Se requiere una contraseña válida.");
          break;
        case 401:
          this.error.set("Solicitud inválida");
          break;
        case 403:
          this.error.set("Prohibido: No tenés permiso");
          break;
        case 422:
          this.error.set("El usuario ya existe");
          break;
        default:
          this.error.set("🔄 Error desconocido. Error Status: " + respuesta.error?.status);
      }
      Swal.fire("Error", this.error(), 'error');
    }
  }
}
