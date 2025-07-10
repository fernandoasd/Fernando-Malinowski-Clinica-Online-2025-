import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/UsuarioService';
import { Disponibilidad, Especialista, Paciente, Turno, Usuario } from '../../interfaces/interfaces';
import { Perfil } from '../../enums/enums';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert-service';
import jsPDF from 'jspdf';
import { HistorialMedico } from '../../components/historial-medico/historial-medico';
import { Titulo } from '../../components/titulo/titulo';


@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, ReactiveFormsModule, HistorialMedico, Titulo],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  us = inject(UsuarioService);
  alert = inject(AlertService);
  historiaClinica: Turno[] = [];
  usuario: any;
  especialista: Especialista = {};
  form!: FormGroup;
  espSelect = "";
  especialidades = ['Medico', 'Traumatologo', 'Cardiologo'];
  miDisponibilidad: Disponibilidad[] = [];
  disponibilidadFiltrada: Disponibilidad = {};
  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  // disponibilidad = [
  //   { especialidad: 'Medico', dia_semana: 'lunes', horario_inicio: '08:00', horario_fin: '12:00' },
  //   { especialidad: 'Medico', dia_semana: 'martes', horario_inicio: '10:00', horario_fin: '14:00' },
  //   { especialidad: 'Traumatologo', dia_semana: 'miércoles', horario_inicio: '09:00', horario_fin: '13:00' },
  //   { especialidad: 'Cardiologo', dia_semana: 'viernes', horario_inicio: '15:00', horario_fin: '18:00' },
  // ];

  // disp: Disponibilidad = {
  //   id_especialista: 5,
  //   especialidad: "cardiología",
  //   duracion_turno: 30,
  //   horarios: [
  //     {
  //       dia_semana: DiaSemana.Lunes,
  //       horario_inicio: "08:00",
  //       horario_fin: "12:00"
  //     },
  //     {
  //       dia_semana: DiaSemana.Miercoles,
  //       horario_inicio: "14:00",
  //       horario_fin: "18:00"
  //     },
  //     {
  //       dia_semana: DiaSemana.Viernes,
  //       horario_inicio: "10:00",
  //       horario_fin: "13:00"
  //     }
  //   ]
  // };


  constructor(private fb: FormBuilder) {
    console.log("disp", Object.keys(this.disponibilidadFiltrada).length === 0);
    this.form = this.fb.group({
      especialidad: ['']
    });


    console.log("this.form.controls", this.form.controls);
  }

  ngOnInit() {
    if (this.us.usuarioActual !== null) {

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
            this.us.traerHistoriaClinica(this.usuario.id_paciente!).then(({ data, error }) => {
              if (error == null && data?.length! > 0) {
                console.log("data: ", data);
                this.historiaClinica = data!;
              }
            });
          }
        });

      }
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

  cargarFormulario(especialidad: string, disponibilidadFiltrada: Disponibilidad) {
    this.form = this.fb.group({
      dias: this.fb.array(this.diasSemana.map((dia) => this.fb.group({
        dia_semana: [dia],
        activo: [disponibilidadFiltrada.horarios?.some(horario => horario.dia_semana === dia) || ""],
        horario_inicio: [disponibilidadFiltrada.horarios?.find((horario) => horario.dia_semana == dia)?.horario_inicio || ""],
        horario_fin: [disponibilidadFiltrada.horarios?.find((horario) => horario.dia_semana == dia)?.horario_fin || ""]
      })))
    });

    this.form.addControl('especialidad', this.fb.control(especialidad));
    this.form.addControl('duracion_turno', this.fb.control(disponibilidadFiltrada?.duracion_turno || 30, [Validators.required, Validators.min(30)]));
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




  //si disponibilidadFiltrada esta vacia, le tiene que cargar los datos para subir a  la BBDD
  actualizarDisponibilidad(horarios: any, duracion_turno: number) {
    console.log("disponiblidad ", this.disponibilidadFiltrada)
    this.disponibilidadFiltrada.especialidad = this.espSelect;
    this.disponibilidadFiltrada.id_especialista = this.usuario.id_especialista;
    this.disponibilidadFiltrada.horarios = horarios;
    this.disponibilidadFiltrada.duracion_turno = duracion_turno;
  }

  async guardarDispBBDD(nuevaDisponibilidad: Disponibilidad) {
    return await this.us.cargarDisponibilidad(nuevaDisponibilidad);
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
      this.disponibilidadFiltrada = this.cargarDisponibilidad(this.espSelect) || {} as Disponibilidad;
      this.cargarFormulario(this.espSelect, this.disponibilidadFiltrada);
      console.log('this.form: ', this.form.controls);
    } else {
      this.espSelect = "";
    }
  }

  guardarDisponibilidad() {
    if (this.form.valid) {

      const diasActivos = this.form.value.dias
        .map((d: any, i: number) => ({
          dia_semana: this.diasSemana[i],
          horario_inicio: d.horario_inicio,
          horario_fin: d.horario_fin,
          activo: d.activo
        }))
        .filter((d: any) => d.activo)
        .map((d: any) => ({
          dia_semana: d.dia_semana,
          horario_inicio: d.horario_inicio,
          horario_fin: d.horario_fin,
        }));

      const errores: string[] = [];
      console.log("this.form.value.dias ", this.form.value.dias);
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
      } else {
        this.alert.confirmarYEnviar("Desea guardar la disponibilidad?").then((result) => {
          try {
            if (result.isConfirmed) {
              // Llamás al servicio para guardar
              this.actualizarDisponibilidad(diasActivos, this.form.get('duracion_turno')?.value);
              console.log("disponibilidadFiltrada ", this.disponibilidadFiltrada);
              this.guardarDispBBDD(this.disponibilidadFiltrada).then(({ data, error }) => {
                if (error == null) {
                  this.disponibilidadFiltrada = data as Disponibilidad;
                  Swal.fire('Enviado', 'La información se cargó correctamente.', 'success');
                } else {
                  Swal.fire('Enviado', 'Error en la BBDD: ' + error.message, 'error');
                }
              });
            }
          } catch (error: any) {
            Swal.fire('Error', 'No se pudo guardar.' + error, 'error');
            throw error;
          }
        })
      }
      console.log('Días válidos:', diasActivos);
    } else {
      Swal.fire('Error', "Validaciones no aprobadas.", 'error');

    }

  }

  descargarHistoriaClinica() {
    if (this.us.usuarioActual!.perfil === Perfil.Paciente) {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      type RGB = [number, number, number];

      const verde: RGB = [30, 170, 70];
      const negro: RGB = [0, 0, 0];

      // Encabezado
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 30, 'F');
      // doc.setTextColor(...verde);
      // doc.setFontSize(16);
      // doc.text("HISTORIA CLÍNICA", 20, 20);
      doc.addImage("logo.jpg", 'JPG', 160, 5, 40, 20);

      // Título del documento
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...negro);
      doc.setFontSize(20);
      doc.text("HISTORIA CLÍNICA", 105, 50, { align: "center" });
      doc.setFontSize(16);
      doc.text(`Paciente: ${this.us.usuarioActual!.nombre} ${this.us.usuarioActual!.apellido}`, 105, 60, { align: "center" });

      const fechaCreacion = new Date();
      const fechaFormateada = `${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`;
      doc.setTextColor(...negro);
      doc.setFontSize(13);
      doc.text(`Fecha de generación del PDF: ${fechaFormateada}`, 20, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      let yPosition = 80;

      // Procesar cada turno
      this.historiaClinica.forEach(turno => {
        // Filtrar solo los turnos con historia clínica
        if (turno && turno.temperatura! > 0) {
          const fechaTurno = new Date(turno.fecha_turno!);
          const fechaTurnoFormateada = turno.fecha_turno
            ? `${fechaTurno.getDate()}/${fechaTurno.getMonth() + 1}/${fechaTurno.getFullYear()}`
            : 'Fecha no disponible';

          // Agregar fecha del turno
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...negro);
          doc.text(`FECHA DEL TURNO: ${fechaTurnoFormateada}`, 20, yPosition);
          yPosition += 10;

          // Agregar datos en formato "Clave: valor" con colores diferenciados
          Object.entries(turno).forEach(([clave, valor]: [string, any]) => {
            if (clave !== 'horario_turno' && clave !== 'fecha_turno' && clave !== 'datos_dinamicos' && clave !== 'resenia' && clave !== 'datos_dinamicos_adicionales') {

              //comprobar si sobrepasa limite inferior de pagina
              if (yPosition > pageHeight - 17) {
                // doc.text(`"yPosition:MMM" ${yPosition}`, valuePosX, yPosition);
                doc.addPage();
                yPosition = 20; //reinicia posicicon en Y
              }

              const formattedKey = clave.charAt(0).toUpperCase() + clave.slice(1);

              let valueWithUnit = `${valor}`;
              switch (clave) {
                case 'altura':
                  valueWithUnit = `${valor} cm`;
                  break;
                case 'peso':
                  valueWithUnit = `${valor} kg`;
                  break;
                case 'temperatura':
                  valueWithUnit = `${valor} °C`;
                  break;
                case 'presion':
                  valueWithUnit = `${valor} mmHg`;
                  break;
                default:
                  break;
              }

              if (clave == "resenia" && turno.resenia) {
                doc.setFont('helvetica', 'bold');
                doc.text("Reseña médica: ", 20, yPosition);
                yPosition += 7;
                Object.entries(turno.resenia!).forEach(([clave, valor]: [string, any]) => {

                  const formattedKey = clave.charAt(0).toUpperCase() + clave.slice(1);
                  let valueWithUnit = `${valor}`;

                  // Clave en verde
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(...verde);
                  doc.text(`- ${formattedKey}:`, 20, yPosition);

                  // Calcular el espacio para el valor y evitar superposición
                  const keyWidth = doc.getTextWidth(`- ${formattedKey}:`);
                  const valuePosX = 20 + keyWidth + 2;  // Espacio para el valor

                  // Verificar si el valor cabe en la línea
                  const pageWidth = doc.internal.pageSize.width - 20;


                  if (valuePosX > pageWidth) {
                    // Si no cabe, siguiente línea
                    yPosition += 7;
                    doc.text(`${valueWithUnit}`, 20, yPosition);
                  } else {
                    // Si cabe, colocamos el valor en la misma línea
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(...negro);
                    doc.text(`${valueWithUnit}`, valuePosX, yPosition);
                  }

                  yPosition += 7; // Incrementar para la siguiente línea

                });
              } else {
                // Clave en verde
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...verde);
                doc.text(`- ${formattedKey}:`, 20, yPosition);

                // Calcular el espacio para el valor y evitar superposición
                const keyWidth = doc.getTextWidth(`- ${formattedKey}:`);
                const valuePosX = 20 + keyWidth + 2;  // Espacio para el valor

                // Verificar si el valor cabe en la línea
                const pageWidth = doc.internal.pageSize.width - 20;
                if (valuePosX > pageWidth) {
                  // Si no cabe, saltamos a la siguiente línea
                  yPosition += 7;
                  doc.text(`${valueWithUnit}`, 20, yPosition);
                } else {
                  // Si cabe, colocamos el valor en la misma línea
                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(...negro);
                  doc.text(`${valueWithUnit}`, valuePosX, yPosition);
                }

                yPosition += 7; // Incrementar para la siguiente línea
              }

            }
          });

          // Agregar datos dinámicos
          if (turno.datos_dinamicos) {

            //comprobar si sobrepasa limite inferior de pagina
            if (yPosition > pageHeight - 17) {
              // doc.text(`"yPosition:MMM" ${yPosition}`, valuePosX, yPosition);
              doc.addPage();
              yPosition = 20; //reinicia posicicon en Y
            }

            doc.setFont('helvetica', 'bold');
            doc.text("Datos dinámicos: ", 20, yPosition);
            yPosition += 7;

            turno.datos_dinamicos.forEach((item: any) => {
              const formattedKey = item.clave.charAt(0).toUpperCase() + item.clave.slice(1);

              // Clave en verde
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(...verde);
              doc.text(`- ${formattedKey}:`, 20, yPosition);

              // Calcular el espacio para el valor y evitar superposición
              const keyWidth = doc.getTextWidth(`- ${formattedKey}:`);
              const valuePosX = 20 + keyWidth + 2;  // Espacio para el valor

              // Verificar si el valor cabe en la línea
              const pageWidth = doc.internal.pageSize.width - 20;
              if (valuePosX > pageWidth) {
                // Si no cabe, saltamos a la siguiente línea
                yPosition += 7;

                //comprobar si sobrepasa limite inferior de pagina
                if (yPosition > 280) {
                  doc.addPage();
                  yPosition = 80; //reinicia posicicon en Y
                }

                doc.text(`${item.valor}`, 20, yPosition);
              } else {
                // Si cabe, colocamos el valor en la misma línea
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...negro);
                doc.text(`${item.valor}`, valuePosX, yPosition);
              }

              yPosition += 7; // Incrementar para la siguiente línea
            });
          };

          // Agregar datos dinámicos ad
          if (turno.datos_dinamicos_adicionales) {

            //comprobar si sobrepasa limite inferior de pagina
            if (yPosition > pageHeight - 17) {
              // doc.text(`"yPosition:MMM" ${yPosition}`, valuePosX, yPosition);
              doc.addPage();
              yPosition = 20; //reinicia posicicon en Y
            }

            doc.setFont('helvetica', 'bold');
            doc.text("Datos dinámicos adicionales: ", 20, yPosition);
            yPosition += 7;

            turno.datos_dinamicos_adicionales.forEach((item: any) => {
              const formattedKey = item.clave.charAt(0).toUpperCase() + item.clave.slice(1);

              // Clave en verde
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(...verde);
              doc.text(`- ${formattedKey}:`, 20, yPosition);

              // Calcular el espacio para el valor y evitar superposición
              const keyWidth = doc.getTextWidth(`- ${formattedKey}:`);
              const valuePosX = 20 + keyWidth + 2;  // Espacio para el valor

              // Verificar si el valor cabe en la línea
              const pageWidth = doc.internal.pageSize.width - 20;
              if (valuePosX > pageWidth) {
                // Si no cabe, saltamos a la siguiente línea
                yPosition += 7;

                //comprobar si sobrepasa limite inferior de pagina
                if (yPosition > 280) {
                  doc.addPage();
                  yPosition = 80; //reinicia posicicon en Y
                }

                doc.text(`${item.valor}`, 20, yPosition);
              } else {
                // Si cabe, colocamos el valor en la misma línea
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...negro);
                doc.text(`${item.valor}`, valuePosX, yPosition);
              }

              yPosition += 7; // Incrementar para la siguiente línea
            });
          }

          yPosition += 10;
        }
      });

      // Pie de página
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...negro);
      doc.text(`© Clinica Online 2025`, 90, 290);

      // Descargar PDF
      doc.save('historia_clinica.pdf');
    } else {
      console.error('El paciente no tiene historia clínica o no es un paciente.');
    }
  }

  modificarHC(t: Turno) {
    console.log("Modificar Turno:", t);
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
