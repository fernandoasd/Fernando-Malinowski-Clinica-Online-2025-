import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './SupabaseService';
import { Especialista, Paciente, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  db = inject(SupabaseService);

  usuarioActual: any[] = [];
  tablaUsuarios;
  tablaPacientes;
  tablaEspecialistas

  constructor() {
    this.tablaUsuarios = this.db.supabase.from("usuarios")
    this.tablaPacientes = this.db.supabase.from("pacientes")
    this.tablaEspecialistas = this.db.supabase.from("especialistas")
    // console.log(this.db);
  }
  async traerUltimoId() {
    return await this.tablaUsuarios.select("id_usuario").order('id_usuario', { ascending: false }).limit(1).then(({ data, error }) => {
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
    return await this.tablaUsuarios.select("*").then(({data, error}) => {
    console.log("data", data);

    const usuarios = data as Usuario[]; //de esta forma data va a ser un array de usuarios
    console.log("listar", usuarios, error);
    return usuarios;
    });

  }

  async buscarUsuarioContrasenia(mail: string, password: string) {
    const { data, error, count, status, statusText } = await this.tablaUsuarios.select("*").eq("mail", mail).eq("contrasenia", password);
    return data;
  }

  async buscarUsuarioMail(mail: string) {
    return await this.tablaUsuarios.select("*").eq("mail", mail);
  }

  async buscarUsuarioId(id_usuario: number) {
    return await this.tablaUsuarios.select("*").eq("id_usuario", id_usuario);
  }

  async cargarUsuario(usuario: Usuario) {
    return await this.tablaUsuarios.insert(usuario).select("*").then(({ data, error }) => {
      if (error == null) {
        if (data && data.length > 0) {
          this.usuarioActual = data;
        }
      } else {
        console.log('cargarUsuario error!!!');
      }
      console.log(' Carga: this.usuarioActual', this.usuarioActual);
      return { data, error };
    });
  }

  async cargarPaciente(p: Paciente) {
    const { data, error, count, status, statusText } = await this.tablaPacientes.insert({ id_usuario: p.id_usuario, obra_social: p.obra_social, imagen_dos: p.imagen_dos });
    console.log("cargar", data, error, count, status, statusText);
  }

  async cargarEspecialista(e: Especialista) {
    const { data, error, count, status, statusText } = await this.tablaEspecialistas.insert({ id_usuario: e.id_usuario, especialidades: e.especialidades });
    console.log("Especialista nuevo: ", e);
    console.log("cargar", data, error, count, status, statusText);
  }

  async modificar(usuario: Usuario) {
    // UPDATE ... where id = n
    const { data, error, count, status, statusText } = await this.tablaUsuarios.update(usuario).eq("nombre", usuario.nombre);
    console.log("modificar", data, error, count, status, statusText);
  }

  async eliminar(id_usuario?: number) {
    if (id_usuario === undefined) return;
    const { data, error, count, status, statusText } = await this.tablaUsuarios.delete().eq("id", id_usuario);
    console.log("eliminar", data, error, count, status, statusText);
  }

  async cargarUsuarioContrasenia(mail: string, password: string) {
    const data = await this.buscarUsuarioContrasenia(mail, password);
    this.usuarioActual = data!;
    console.log(this.usuarioActual);
  }

  async cargarUsuarioMail(mail: string) {
    // this.traerUltimoId();
    const { data, error } = await this.buscarUsuarioMail(mail);
    this.usuarioActual = data!;
    console.log("Usuario actual:", this.usuarioActual);
    return data;
  }
}
