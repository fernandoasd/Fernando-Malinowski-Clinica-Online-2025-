
export class Usuario {
    // con ? puede ser undefined
    nombre?: string;
    apellido?: string;
    edad?: number;
    dni?: string;
    obra_social?: string;
    mail?: string;
    contrasenia?: string;
    imagen_uno?: string;
    imagen_dos?: string;
    especialidad?: string;
    perfil?: string;
    activo?: boolean;

    constructor(mail: string, contrasenia: string, nombre: string, apellido: string, 
        edad: number, dni: string, obra_social: string,  perfil: string = "usuario",
        especialidad: string = "", imagen_uno: string = "", imagen_dos: string = "", activo: boolean = true) {

        this.mail = mail;
        this.dni = dni;
        this.obra_social = obra_social;
        this.edad = edad;
        this.contrasenia = contrasenia;
        this.nombre = nombre;
        this.apellido = apellido;
        this.imagen_uno = imagen_uno;
        this.imagen_dos = imagen_dos;
        this.perfil = perfil;
        this.activo = activo;
        this.especialidad = especialidad;
    }
}