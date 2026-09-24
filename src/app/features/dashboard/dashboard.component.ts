import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { finalize, forkJoin } from 'rxjs';
import { ActivoService } from '../../core/services/activo.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { showLoading, showNotifyError } from '../../shared/Utilities';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly activoService = inject(ActivoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly totalActivos = signal<number | null>(null);
  readonly totalCategorias = signal<number | null>(null);

  constructor() {
    showLoading();
    forkJoin({
      activos: this.activoService.obtenerActivos({ page: 0, size: 1 }),
      categorias: this.categoriaService.obtenerCategorias()
    })
      .pipe(finalize(() => showLoading(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ activos, categorias }) => {
          this.totalActivos.set(activos.totalElements);
          this.totalCategorias.set(categorias.length);
        },
        error: (error: unknown) => showNotifyError('No fue posible cargar el resumen del sistema.', error)
      });
  }
}
