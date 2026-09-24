import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReporteResponse } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);

  obtenerReporteActivos(): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(`${environment.apiUrl}/api/reportes/activos`);
  }
}
