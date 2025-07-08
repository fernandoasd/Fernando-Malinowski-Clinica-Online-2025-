import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { Perfil } from '../../../enums/enums';
import { Usuario, Paciente, Especialista } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/AuthService';
import { UsuarioService } from '../../../services/UsuarioService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reegistro-especialista',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reegistro-especialista.html',
  styleUrl: './reegistro-especialista.css'
})
export class ReegistroEspecialista {
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
  perfil = Perfil.Especialista;
  obra_social: string = "";
  imagen_uno: string = "";
  imagen_dos: string = "";
  especialidad: string = "";
  nuevaEspecialidad: string = "";
  especialidades: string[] = [];
  activo: boolean = true;
  hayError: boolean = false;
  mailEjemplo = "ejemplo@gmail.com";
  mensajeErrorEspecialidad = "";

  opcionSeleccionada: string = "otro";
  otraOpcion: string = '';

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

    constructor(private router: Router) {
  }
  
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
    dni: new FormControl("38000000", {
      validators: [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.required],
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
    especialidad: new FormControl("---", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]
    }),
    nuevaEspecialidad: new FormControl("---", {
      validators: [
        // Validators.required,
        // Validators.minLength(3),
        // Validators.maxLength(15),
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

  agregarEspecialidad(especialidad: string) {
    this.mensajeErrorEspecialidad = "";
    especialidad = especialidad.toLowerCase();
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

  validarImagen(control: AbstractControl, maxSizeMB: number = 2): ValidationErrors | null {
    const file = control.value;
    console.log("control: ", control);
    if (!file) return null; // No hay archivo aún

    const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = file.split('.').pop()?.toLowerCase();

    // Validar tipo
    if (!extension || !extensionesPermitidas.includes(extension)) {
      return { tipoInvalido: true };
    }

    // if (!file.type.startsWith('image/')) {
    //   return { tipoInvalido: true };
    // }

    // Validar tamaño
    // const maxSizeBytes = maxSizeMB * 1024 * 1024;
    // if (file.size > maxSizeBytes) {
    //   return { tamanoExcedido: true };
    // }

    return null; // válido
  }

  onFileSelected(event: any) {
    console.log("event: ", event)
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enviar() {
    console.log("perfil ", this.perfil);
    if (this.formulario.valid) {
      if (this.especialidades.length > 0) {

        console.log("Se puede enviar");

        Swal.fire({
          title: "Crear cuenta??",
          showDenyButton: true,
          icon: 'question',
          confirmButtonText: "Crear",
          denyButtonText: `Cancelar`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.us.traerUsuarioMail(this.mail).then((respuesta) => {
              //Verifico que el mail no existe en la tabla usuarios, si es asi creo una nueva cuenta
              if (respuesta.data?.length! == 0) {
                this.us.db.subirFotoPerfil(this.imagenSeleccionada!).then((retorno) => {
                  this.registrarse(this.perfil, retorno!.linkPublico!.data!.publicUrl || "");
                });
              } else {
                Swal.fire("Error", "El mail ya esta siendo usado", 'warning');
              }
            })
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: "Error",
          text: "Debe ingresar al menos una especialidad",
          draggable: true
        });
      }

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

  async registrarse(perfil: Perfil, linkPublico: string) {
    const respuesta = await this.auth.crearCuenta(this.mail, this.contrasenia);
    if (respuesta.error === null) {

      let nuevoUsuario: Usuario = {
        mail: this.mail.toLowerCase(),
        contrasenia: this.contrasenia,
        nombre: this.nombre.toLowerCase(),
        apellido: this.apellido.toLowerCase(),
        edad: this.edad,
        documento: this.dni,
        perfil: perfil,
        imagen_uno: linkPublico,
        activo: false,
      };

      await this.us.cargarUsuario(nuevoUsuario).then(({ data, error }) => {
        if (error == null) {
          if (data && data.length > 0) {
            nuevoUsuario.id_usuario = data[0]!.id_usuario;
            console.log("nuevoUsuario :", nuevoUsuario);
            console.log("perfil :", perfil);

            if (perfil === Perfil.Especialista) {
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




            this.formulario.reset();
            Swal.fire("Cuenta creada. Por favor, confirme su mail para poder activar su cuenta.", 'success').then((respuesta) => {
              console.log("Respuesta ", respuesta);
              if (respuesta.isConfirmed)
                this.router.navigate(['/login']);
            });
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

