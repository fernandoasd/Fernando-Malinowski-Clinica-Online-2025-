import { Routes } from '@angular/router';
import { PageNotFound } from './pages/page-not-found/page-not-found';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: 'full',
    },
    {
        path: "home",
        title: "Home",
        loadComponent: () => import("./pages/home/home").then((a) => a.Home)
    },
    {
        path: "login",
        title: "Login",
        loadComponent: () => import("./pages/login/login").then((a) => a.Login)
    },
    {
        path: "usuarios",
        title: "Usuarios",
        loadComponent: () => import("./pages/usuarios/usuarios").then((a) => a.Usuarios),
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
                component: PageNotFound
            }
        ]
    },
    {
        path: "**",
        title: "Page Not Found",
        component: PageNotFound
    }
];
