import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './SupabaseService';
import { Disponibilidad, Especialista, Paciente, Turno, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  db = inject(SupabaseService);

  usuarioActual: Usuario | null = null;

  constructor() {
  }

  async traerUltimoId() {
    return await this.db.supabase.from("usuarios").select("id_usuario").order('id_usuario', { ascending: false }).limit(1).then(({ data, error }) => {
      let ultimoId = -1;
      if (error == null) {
        if (data && data.length > 0) {
          ultimoId = data[0].id_usuario;
        }
      } else {
        console.log('Último ID: -1 , error!!!');
      }
      console.log('Último ID:', ultimoId);
      return ultimoId;
    });
  }

  async traerUsuarios() {
    return await this.db.supabase.from("usuarios").select("*").order("perfil", { ascending: false }).then(({ data, error }) => {
      console.log("data", data);

      const usuarios = data as Usuario[]; //de esta forma data va a ser un array de usuarios
      console.log("listar", usuarios, error);
      return usuarios;
    });

  }

  async traerUsuarioContrasenia(mail: string, password: string) {
    const { data, error, count, status, statusText } = await this.db.supabase.from("usuarios").select("*").eq("mail", mail).eq("contrasenia", password);
    return data;
  }

  async traerUsuarioMail(mail: string) {
    return await this.db.supabase.from("usuarios").select("*").eq("mail", mail);
  }

  async traerUsuarioId(id_usuario: number) {
    return await this.db.supabase.from("usuarios").select("*").eq("id_usuario", id_usuario);
  }

  async cargarUsuario(usuario: Usuario) {
    return await this.db.supabase.from("usuarios").insert(usuario).select("*").then(({ data, error }) => {
      if (error == null) {
        if (data && data.length > 0) {
          this.usuarioActual = data![0];
        }
      } else {
        console.log('cargarUsuario error!!!');
      }
      console.log(' Carga: this.usuarioActual', this.usuarioActual);
      return { data, error };
    });
  }

  async cargarPaciente(p: Paciente) {
    const { data, error, count, status, statusText } = await this.db.supabase.from("pacientes").insert({ id_usuario: p.id_usuario, obra_social: p.obra_social, imagen_dos: p.imagen_dos });
    console.log("cargar", data, error, count, status, statusText);
  }

  async cargarEspecialista(e: Especialista) {
    const { data, error, count, status, statusText } = await this.db.supabase.from("especialistas").insert({ id_usuario: e.id_usuario, especialidades: e.especialidades });
    console.log("Especialista nuevo: ", e);
    console.log("cargar", data, error, count, status, statusText);
  }

  async modificarUsuario(usuario: Usuario) {
    // UPDATE ... where id = n
    const { data, error, count, status, statusText } = await this.db.supabase.from("usuarios").update(usuario).eq("nombre", usuario.nombre);
    console.log("modificar", data, error, count, status, statusText);
  }

  async eliminarUsuario(id_usuario?: number) {
    if (id_usuario === undefined) return;
    const { data, error, count, status, statusText } = await this.db.supabase.from("usuarios").delete().eq("id", id_usuario);
    console.log("eliminar", data, error, count, status, statusText);
  }

  async cargarUsuarioContrasenia(mail: string, password: string) {
    const data = await this.traerUsuarioContrasenia(mail, password);
    this.usuarioActual = data![0];
    console.log(this.usuarioActual);
  }

  async cargarUsuarioMail(mail: string) {
    // this.traerUltimoId();
    const { data, error } = await this.traerUsuarioMail(mail);
    if (error) {
      console.log(error)
    }
    this.usuarioActual = (data![0]) as Usuario;
    console.log("Usuario actual:", this.usuarioActual);
    return data;
  }

  async deshabilitarUsuario(id_usuario: number, activo: boolean) {
    return await this.db.supabase.from("usuarios").update({ activo: !activo }).eq("id_usuario", id_usuario);
  }

  async traerDisponibilidad(id_especialista: number, especialidad: string = "") {
    if (especialidad == "") {
      const { data, error } = await this.db.supabase.from("disponibilidad").select("*").eq("id_especialista", id_especialista);
      if (error) {
        console.log(error)
      }
      return { data, error };
    } else {
      const { data, error } = await this.db.supabase.from("disponibilidad").select("*").eq("id_especialista", id_especialista).eq("especialidad", especialidad);
      if (error) {
        console.log(error)
      }
      return { data, error };
    }
  }

  async cargarDisponibilidad(disp: Disponibilidad) {
    const { data, error } = await this.db.supabase.from("disponibilidad").upsert(disp, { onConflict: "id_disponibilidad" }).select().single();
    if (error) {
      console.log(error);
    }
    return { data, error };
  }

  async traerEspecialistas() {
    const { data, error } = (((await this.db.supabase.from("especialistas").select("*"))));
    if (error) {
      console.log(error)
    }
    const especialistas = data!.map(item => ({
      ...item,
      ...item.usuarios
    }));
    especialistas.forEach(obj => delete (obj as any).usuarios);
    return { especialistas, error };
  }

  async traerEspecialistasCompleto() {
    const { data, error } = (((await this.db.supabase.from("especialistas").select("*, usuarios(*)"))));
    if (error) {
      console.log(error)
    }
    const especialistas = data!.map(item => ({
      ...item,
      ...item.usuarios
    }));
    especialistas.forEach(obj => delete (obj as any).usuarios);
    return { especialistas, error };
  }

    async traerEspecialistasActivos() {
    const { data, error } = (((await this.db.supabase.from("usuarios").select("*, especialistas(*)").eq("perfil", "especialista").eq("activo", true))));
    let especialistas = [];
    if (error) {
      console.log(error)
    } else if (data){
          especialistas = data!.map(item => ({
      ...item,
      ...item.especialistas[0]
    }));
    }
    especialistas.forEach(obj => delete (obj as any).especialistas);
    return { especialistas, error };
  }

  async traerEspecialistaId(id_especialista: number) {
    const { data, error } = await this.db.supabase.from("especialistas")
      .select("*, usuarios(*)").eq("id_especialista", id_especialista);
    if (error) {
      console.log(error)
    }
    const especialista = data!.map(item => ({
      ...item,
      ...item.usuarios
    }));
    especialista.forEach(obj => delete (obj as any).usuarios);
    return { especialista, error };
  }

  async traerPacienteUsuarioId(id_usuario: number) {
    const { data, error } = await this.db.supabase.from("pacientes").select("*, ...usuarios(*)").eq("id_usuario", id_usuario);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

    async traerPacientes() {
    const { data, error } = await this.db.supabase.from("pacientes").select("*, ...usuarios(*)");
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async traerEspecialistaUsuarioId(id_usuario: number) {
    const { data, error } = await this.db.supabase.from("especialistas").select("*, ...usuarios(*)").eq("id_usuario", id_usuario);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async cargarTurno(nuevoTurno: Turno) {
    const { data, error } = await this.db.supabase.from("turnos").insert(nuevoTurno);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async traerTurnosPaciente(id_paciente: number) {
    const { data, error } = await this.db.supabase.from("turnos").select("*, especialistas(*,...usuarios(*)), pacientes(*, ...usuarios(*))").eq("id_paciente", id_paciente);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async traerTurnosEspecialista(id_especialista: number) {
    const { data, error } = await this.db.supabase.from("turnos").select("*, especialistas(*,...usuarios(*)), pacientes(*, ...usuarios(*))").eq("id_especialista", id_especialista);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async actualizarTurno(Turno: Turno) {
    const { data, error } = await this.db.supabase.from("turnos").update(Turno).eq("id", Turno.id);
    if (error) {
      console.log(error)
    }
    return { data, error };
  }

  async cargarResenia(resenia: { resenia: string, diagnostico: string }) {

  }

  async traerHistoriaClinica(id_paciente: number) {
    const { data, error } = await this.db.supabase.from("turnos").select("fecha_turno, horario_turno, altura, peso, temperatura, presion, datos_dinamicos, resenia").eq("id_paciente", id_paciente).eq("estado", "Finalizado");
    if (error) {
      console.log(error);
    }
    return { data, error };
  }

  async cargarIngreso(id_usuario: number) {
    const { error } = await this.db.supabase.from("ingresos").insert({ id_usuario: id_usuario });
    if (error) {
      console.log(error);
    }
    console.log("Nuevo Ingreso, usuario: ", id_usuario);
    return { error };
  }

  async traerIngresos() {
    const { data, error } = await this.db.supabase.from("ingresos").select("*");
    if (error) {
      console.log(error);
    }
    return { data, error };
  }

}
