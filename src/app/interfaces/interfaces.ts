import { EstadoTurno, Perfil } from "../enums/enums";

export interface Usuario {
    id_usuario?: number;
    created_at?: Date; 
    mail?: string;
    nombre?: string;
    apellido?: string;
    documento?: string;
    edad?: number;
    perfil?: Perfil;
    imagen_uno?: string;
    activo?: boolean;
    contrasenia?: string;
}

export interface Especialista extends Usuario {
    especialidades: string[];
}

export interface Paciente extends Usuario{
    obra_social?: string;
    imagen_dos?: string;
}

export interface Disponibilidad {
    especialista: string;
    especialidad: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    duracionTurnos: number;
}

export interface Turno {
    medico: string;
    medicoNombreCompleto: string | null;
    pacienteNombreCompleto: string | null;
    fecha: string;
    horario: string;
    especialidad: string;
    paciente: string;
    estado: EstadoTurno;
    resenia?: { resenia: string, diagnostico: string };
    encuesta?: { consejo: string, instalaciones: number, recomendacion: string };
    calificacion?: string;
    altura?: number | null;
    peso?: number | null;
    temperatura?: number | null;
    presion?: string | null;
    datosDinamicos?: Array<{ clave: string; valor: string }>;
    fechaSolicitud?: Date | null;
}
