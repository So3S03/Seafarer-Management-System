import { LoginComponent } from './components/Authentication/login/login.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/main/home/home.component';
import { authorizedGuard } from './core/guards/authorized.guard';
import { unAuthorizedGuard } from './core/guards/un-authorized.guard';

export const routes: Routes = [
    {path: "", component: AuthLayoutComponent,  canActivate: [authorizedGuard], children: [
        {path: "", redirectTo: "Login", pathMatch: "full"},
        {path: "Login", component: LoginComponent}
    ]},
    {path: "", component: MainLayoutComponent, canActivate: [unAuthorizedGuard], children: [
        {path: "", redirectTo: "Home", pathMatch: "full"},
        {path: "Home", component: HomeComponent}
        ]},
    {path: "**", loadComponent: () => import("./components/common/not-found/not-found.component").then(e => e.NotFoundComponent)}
];
