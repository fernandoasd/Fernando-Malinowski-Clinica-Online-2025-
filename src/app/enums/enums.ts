export enum Perfil {
    Admin = "admin",
    Paciente = "paciente",
    Especialista = "especialista",
    Anonimo = "anon",
}

export enum EstadoTurno {
    Pendiente = "Pendiente",
    Aceptado = "Aceptado",
    Rechazado = "Rechazado",
    Finalizado = "Finalizado",
    Cancelado = "Cancelado"
}

export enum Informe {
    Ingresos = 0,
    TurnosPorEspecialidad = 1,
    TurnosPorDia = 2,
    TurnosSolicitadosPorMedicoEnTiempo = 3,
    TurnosFinalizadosPorMedicoEnTiempo = 4
}

export enum DiaSemana {
    domingo = "domingo",
    Lunes = "lunes",
    Martes = "martes",
    Miercoles = "miercoles",
    Jueves = "jueves",
    Viernes = "viernes",
    Sabado = "sabado"
}

export enum TipoControl{
    rango = "rango",
    numerico = "numerico",
    switch = "switch"
}