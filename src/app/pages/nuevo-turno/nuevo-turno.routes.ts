import { Routes } from "@angular/router";
import { NuevoTurno } from "./nuevo-turno";


export const nuevo_turno: Routes = [
    {
        path: "",
        component: NuevoTurno,
        children: [
            {
                path: "",
                loadComponent: () => import("./lista-medicos/lista-medicos").then((a) => a.ListaMedicos),
            },
            {
                path: "especialidad",
                loadComponent: () => import("./especialidades/especialidades").then((a) => a.Especialidades),
            },
            {
                path: "disponibilidad",
                loadComponent: () => import("./disponibilidad-medico/disponibilidad-medico").then((a) => a.DisponibilidadMedico),
            }
        ]
    }
];