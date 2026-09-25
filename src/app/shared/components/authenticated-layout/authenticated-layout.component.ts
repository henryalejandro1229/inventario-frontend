import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationItem } from '../../models/navigation-item.model';
import { showNotifySuccess } from '../../Utilities';

@Component({
  selector: 'app-authenticated-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss',
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly currentUser = this.authService.currentUser;
  readonly navigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: ['ADMIN', 'USER'],
    },
    {
      label: 'Activos',
      icon: 'devices',
      route: '/activos',
      roles: ['ADMIN', 'USER'],
    },
    {
      label: 'Categorías',
      icon: 'category',
      route: '/categorias',
      roles: ['ADMIN', 'USER'],
    },
    {
      label: 'Reportes',
      icon: 'assessment',
      route: '/reportes',
      roles: ['ADMIN', 'USER'],
    },
  ];

  canShow(item: NavigationItem): boolean {
    return (
      !!this.currentUser() && item.roles.includes(this.currentUser()!.role)
    );
  }
  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']).then(() => {
      void showNotifySuccess('Sesión cerrada correctamente.');
    });
  }
}
