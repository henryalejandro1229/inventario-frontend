import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ActivoListComponent } from './features/activos/pages/activo-list/activo-list.component';
import { CategoriasComponent } from './features/categorias/categorias.component';
import { ReportesComponent } from './features/reportes/reportes.component';
import { AuthenticatedLayoutComponent } from './shared/components/authenticated-layout/authenticated-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: AuthenticatedLayoutComponent, canActivate: [authGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'activos', component: ActivoListComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
