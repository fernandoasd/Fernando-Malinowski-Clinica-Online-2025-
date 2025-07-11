import { DiaSemana, EstadoTurno, Perfil, TipoControl } from "../enums/enums";

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
    id_especialista?: number;
    especialidades?: string[];
    disponibilidad?: Disponibilidad[];
}

export interface Paciente extends Usuario {
    id_paciente?: number;
    obra_social?: string;
    imagen_dos?: string;
}

export interface Disponibilidad {
    id_disponibilidad?: number;
    id_especialista?: number;
    especialidad?: string;
    duracion_turno?: number;
    horarios?: Array<{
        dia_semana?: DiaSemana;
        horario_inicio?: string;
        horario_fin?: string;
    }>;
}

export interface Turno {
    id?: number;
    id_especialista?: number | null;
    id_paciente?: number | null;
    fecha_turno?: string;
    horario_turno?: string;
    especialidad?: string;
    estado?: EstadoTurno;
    info_estado?: string;
    resenia?: { resenia: string, diagnostico: string };
    encuesta?: { consejo: string, recomendacion: string };
    calificacion?: string;
    altura?: number | null;
    peso?: number | null;
    temperatura?: number | null;
    presion?: number | null;
    datos_dinamicos?: Array<{ clave: string; valor: string }>;
    datos_dinamicos_adicionales?: Array<{ clave: string; valor: string; tipo: TipoControl}>;
    fechaSolicitud?: Date | null;
}


