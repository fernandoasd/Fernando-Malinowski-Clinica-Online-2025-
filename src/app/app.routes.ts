import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: 'full'
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
        path: "registro",
        title: "Registro",
        loadComponent: () => import("./pages/registrarse/registrarse").then((a) => a.Registrarse)
    }
];
