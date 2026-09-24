import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { ReporteService } from '../../core/services/reporte.service';
import { base64ToBlob, downloadBlob } from '../../shared/utils/file-download.util';
import { showLoading, showNotifyError, showNotifySuccess } from '../../shared/Utilities';

@Component({
  selector: 'app-reportes',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly destroyRef = inject(DestroyRef);
  readonly isGenerating = signal(false);

  generarReporte(): void {
    showLoading();
    this.isGenerating.set(true);
    this.reporteService.obtenerReporteActivos()
      .pipe(finalize(() => { this.isGenerating.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reporte) => {
          const blob = base64ToBlob(reporte.fileBase64, 'application/zip');
          downloadBlob(blob, reporte.fileName);
          void showNotifySuccess(reporte.message || 'Reporte generado correctamente.');
        },
        error: (error: unknown) => showNotifyError('No fue posible generar el reporte.', error)
      });
  }
}
