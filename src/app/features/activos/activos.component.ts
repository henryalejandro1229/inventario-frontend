import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-activos', imports: [RouterLink, MatButtonModule, MatCardModule], template: `<section><div class="header"><div><h1>Activos</h1><p>Consulta de activos tecnológicos.</p></div>@if (isAdmin()) { <a mat-flat-button color="primary" routerLink="nuevo">Nuevo activo</a> }</div><mat-card><p>El listado de activos se integrará en la siguiente etapa.</p></mat-card></section>`, styles: [`.header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px}h1{margin:0}p{color:#5f6368}mat-card{padding:20px}`] })
export class ActivosComponent { private readonly auth = inject(AuthService); isAdmin(): boolean { return this.auth.currentUser()?.role === 'ADMIN'; } }
