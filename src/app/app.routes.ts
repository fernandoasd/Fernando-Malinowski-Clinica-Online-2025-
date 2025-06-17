import { Routes } from '@angular/router';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { logueadoGuard } from './guards/logueado-guard';
import { adminGuard } from './guards/admin-guard';
import { pacienteGuard } from './guards/paciente-guard';
import { especialistaGuard } from './guards/especialista-guard';

export const routes: Routes = [
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
                component: PageNotFound
            }
        ]
    },
    {
        path: "solicitar-turno",
        title: "solicitar-turno",
        loadChildren: () => 
            import("./pages/nuevo-turno/nuevo-turno.routes").then(m => m.nuevo_turno),
        canActivate: [pacienteGuard]
    },
    {
        path: "mis-turnos",
        title: "Mis turnos",
        loadChildren: () => 
            import("./pages/mis-turnos/mis-turnos.routes").then(m => m.mis_turnos),
        canActivate: []
    },
    {
        path: "",
        redirectTo: "home",
        pathMatch: 'full',
    },
    {
        path: "**",
        title: "Page Not Found",
        component: PageNotFound
    }
]; 
