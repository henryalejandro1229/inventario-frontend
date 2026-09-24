import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly currentUserSignal = signal<User | null>(this.getUserFromToken());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null && this.tokenStorage.hasToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, credentials).pipe(
      tap((response) => {
        this.tokenStorage.setToken(response.token);
        this.currentUserSignal.set(this.getUserFromToken() ?? { username: response.username, role: response.rol });
      })
    );
  }

  logout(): void {
    this.tokenStorage.removeToken();
    this.currentUserSignal.set(null);
  }

  private getUserFromToken(): User | null {
    const token = this.tokenStorage.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(this.decodePayload(token)) as { sub?: unknown; rol?: unknown };
      if (typeof payload.sub !== 'string' || (payload.rol !== 'ADMIN' && payload.rol !== 'USER')) return null;
      return { username: payload.sub, role: payload.rol };
    } catch { return null; }
  }

  private decodePayload(token: string): string {
    const payload = token.split('.')[1];
    if (!payload) throw new Error('JWT inválido');
    return decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
  }
}
