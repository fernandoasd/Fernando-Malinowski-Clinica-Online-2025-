import { Routes } from '@angular/router';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { logueadoGuard } from './guards/logueado-guard';
import { adminGuard } from './guards/admin-guard';
import { pacienteGuard } from './guards/paciente-guard';
import { adminPacienteGuard } from './guards/admin-paciente-guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: 'full',
    },
    {
        path: "home",
        title: "Home",
        redirectTo: "graficos",

        // loadComponent: () => import("./pages/home/home").then((a) => a.Home)
        
    },
    {
        path: "login",
        title: "Login",
        loadComponent: () => import("./pages/login/login").then((a) => a.Login)
    },
    {
        path: "about",
        title: "About",
        loadComponent: () => import("./pages/about/about.component").then((a) => a.AboutComponent),
        canActivate: [logueadoGuard]
    },
    {
        path: "usuarios",
        title: "Usuarios",
        loadComponent: () => import("./pages/usuarios/usuarios").then((a) => a.Usuarios),
        canActivate: [adminGuard],
        children: [
            {
                path: "",
                title: "Usuario-Home",
                loadComponent: () => import("./pages/usuarios/usuarios-home/usuarios-home").then(m => m.UsuariosHome)
            },
            {
                path: "registro-paciente",
                title: "Registro Admin",
                loadComponent: () => import("./pages/registrarse/registro-paciente/reegistro-paciente").then(m => m.ReegistroPaciente)

            },
            {
                path: "registro-especialista",
                title: "Registro Admin",
                loadComponent: () => import("./pages/registrarse/registro-especialista/reegistro-especialista").then(m => m.ReegistroEspecialista)

            },
            {
                path: "registro-admin",
                title: "Registro Admin",
                loadComponent: () => import("./pages/usuarios/registro-admin/reegistro-admin").then(m => m.ReegistroAdmin)
            },
        ]
    },
    {
        path: "registro",
        title: "Registro",
        loadComponent: () => import("./pages/registrarse/registrarse").then((a) => a.Registrarse),
        children: [
            {
                path: "",
                title: "Registro",
                loadComponent: () => import("./pages/registrarse/cards/cards").then(m => m.Cards)
            },
            {
                path: "paciente",
                title: "Registro Paciente",
                loadComponent: () => import("./pages/registrarse/registro-paciente/reegistro-paciente").then(m => m.ReegistroPaciente)
            },
            {
                path: "especialista",
                title: "Registro Especialista",
                loadComponent: () => import("./pages/registrarse/registro-especialista/reegistro-especialista").then(m => m.ReegistroEspecialista)
            },
            {
                path: "**",
                title: "Page Not Found",
                loadComponent: () => import("./pages/page-not-found/page-not-found").then(m => m.PageNotFound),

            }
        ]
    },
    {
        path: "solicitar-turno",
        title: "solicitar-turno",
        loadChildren: () => import("./pages/nuevo-turno/nuevo-turno.routes").then(m => m.nuevo_turno),
        canActivate: [adminPacienteGuard]
    },
    {
        path: "mis-turnos",
        title: "Mis turnos",
        loadChildren: () => import("./pages/mis-turnos/mis-turnos.routes").then(m => m.mis_turnos),
        canActivate: []
    },
    {
        path: "mi-perfil",
        title: "Mi perfil",
        loadComponent: () => import("./pages/mi-perfil/mi-perfil").then(m => m.MiPerfil),
    },
    {
        path: "captcha",
        title: "captcha",
        loadComponent: () => import("./pages/captcha/captcha").then(m => m.Captcha),
    },
    {
        path: "graficos",
        title: "graficos",
        loadComponent: () => import("./components/graficos/graficos").then((a) => a.Graficos),
        children: [
            {
                path: "ingresos",
                title: "Graficos",
                loadComponent: () => import("./components/graficos/ingresos/ingresos").then(m => m.Ingresos)
            },
            {
                path: "turnos-dia",
                title: "Graficos",
                loadComponent: () => import("./components/graficos/turnos-dia/turnos-dia").then(m => m.TurnosDia)
            },
            {
                path: "turnos-especialidad",
                title: "Graficos",
                loadComponent: () => import("./components/graficos/turnos-especialidad/turnos-especialidad").then(m => m.TurnosEspecialidad)
            },
            {
                path: "turnos-solicitados",
                title: "Graficos",
                loadComponent: () => import("./components/graficos/turnos-solicitados-medico/turnos-solicitados-medico").then(m => m.TurnosSolicitadosMedico)
            },
            {
                path: "turnos-finalizados",
                title: "Graficos",
                loadComponent: () => import("./components/graficos/turnos-finalizados-medico/turnos-finalizados-medico").then(m => m.TurnosFinalizadosMedico)
            },
            
        ]
    },
    {
        path: "**",
        title: "Page Not Found",
        loadComponent: () => import("./pages/page-not-found/page-not-found").then(m => m.PageNotFound),
    }
]; 
