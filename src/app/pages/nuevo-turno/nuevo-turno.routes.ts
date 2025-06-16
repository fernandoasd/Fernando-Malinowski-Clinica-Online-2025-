import { Routes } from "@angular/router";
import { DisponibilidadMedico } from "./disponibilidad-medico/disponibilidad-medico";
import { NuevoTurno } from "./nuevo-turno";
import { ListaMedicos } from "./lista-medicos/lista-medicos";

export const nuevo_turno: Routes = [
    {
        path: "",
        component: NuevoTurno,
        children: [
            {
                path: "",
                component: ListaMedicos,
            },
            {
                path: "disponibilidad",
                component: DisponibilidadMedico
            }
        ]
    }
];