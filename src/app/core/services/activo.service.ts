import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Activo, ActivoFilters, ActivoRequest, CambioEstadoRequest } from '../models/activo.model';
import { PageResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ActivoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/activos`;

  obtenerActivos(filters: ActivoFilters = {}): Observable<PageResponse<Activo>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value));
    }
    return this.http.get<PageResponse<Activo>>(this.baseUrl, { params });
  }

  crear(request: ActivoRequest): Observable<Activo> {
    return this.http.post<Activo>(this.baseUrl, request);
  }

  actualizar(id: string, request: ActivoRequest): Observable<Activo> {
    return this.http.put<Activo>(`${this.baseUrl}/${id}`, request);
  }

  cambiarEstado(id: string, request: CambioEstadoRequest): Observable<Activo> {
    return this.http.patch<Activo>(`${this.baseUrl}/${id}/estado`, request);
  }
}
