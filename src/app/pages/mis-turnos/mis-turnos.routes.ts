import { Routes } from "@angular/router";
import { MisTurnos } from "./mis-turnos";



export const mis_turnos: Routes = [
    {
        path: "",
        component: MisTurnos,
        children: [
            {
                path: "paciente",
                loadComponent: () => import("./turnos-paciente/turnos-paciente").then((a) => a.TurnosPaciente),
            },
            {
                path: "especialista",
                loadComponent: () => import("./turnos-especialista/turnos-especialista").then((a) => a.TurnosEspecialista),
            }
        ]
    }
];