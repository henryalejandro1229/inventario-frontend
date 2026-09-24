import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Activo, ActivoFilters, EstadoActivo } from '../../../../core/models/activo.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { ActivoService } from '../../../../core/services/activo.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DEFAULT_DIALOG_CONFIG } from '../../../../shared/config/dialog.config';
import { ESTADOS_ACTIVO, estadoChipClass, estadoLabel } from '../../../../shared/utils/estado.util';
import { showLoading, showNotifyError } from '../../../../shared/utils/sweetalert';
import { ActivoFormDialogComponent } from '../../dialogs/activo-form-dialog/activo-form-dialog.component';
import { CambioEstadoDialogComponent } from '../../dialogs/cambio-estado-dialog/cambio-estado-dialog.component';

@Component({
  selector: 'app-activo-list',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, MatButtonModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule],
  templateUrl: './activo-list.component.html',
  styleUrl: './activo-list.component.scss'
})
export class ActivoListComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly activoService = inject(ActivoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['folioInventario', 'numeroSerie', 'marcaModelo', 'categoriaNombre', 'estado', 'costoAdquisicion', 'fechaIngreso', 'acciones'];
  readonly estados: EstadoActivo[] = ESTADOS_ACTIVO;
  readonly activos = signal<Activo[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly totalElements = signal(0);
  readonly isLoading = signal(false);
  pageIndex = 0;
  pageSize = 10;
  sort = 'fechaIngreso,desc';
  readonly filtersForm = this.formBuilder.group({ numeroSerie: [''], marcaModelo: [''], categoriaId: [null as number | null], estado: [null as EstadoActivo | null], costoMin: [null as number | null], costoMax: [null as number | null] });

  readonly estadoLabel = estadoLabel;
  readonly estadoChipClass = estadoChipClass;

  constructor() { this.loadInitialData(); }

  isAdmin(): boolean { return this.authService.currentUser()?.role === 'ADMIN'; }
  buscar(): void { this.pageIndex = 0; this.loadActivos(); }
  limpiar(): void { this.filtersForm.reset(); this.pageIndex = 0; this.loadActivos(); }
  changePage(event: PageEvent): void { this.pageIndex = event.pageIndex; this.pageSize = event.pageSize; this.loadActivos(); }
  changeSort(sort: Sort): void { this.sort = sort.direction ? `${sort.active},${sort.direction}` : 'fechaIngreso,desc'; this.pageIndex = 0; this.loadActivos(); }

  nuevoActivo(): void {
    const dialogRef = this.dialog.open(ActivoFormDialogComponent, { ...DEFAULT_DIALOG_CONFIG, data: null });
    dialogRef.afterClosed().subscribe((changed) => { if (changed) this.loadActivos(); });
  }

  editarActivo(activo: Activo): void {
    const dialogRef = this.dialog.open(ActivoFormDialogComponent, { ...DEFAULT_DIALOG_CONFIG, data: activo });
    dialogRef.afterClosed().subscribe((changed) => { if (changed) this.loadActivos(); });
  }

  cambiarEstado(activo: Activo): void {
    const dialogRef = this.dialog.open(CambioEstadoDialogComponent, { ...DEFAULT_DIALOG_CONFIG, width: '480px', data: activo });
    dialogRef.afterClosed().subscribe((changed) => { if (changed) this.loadActivos(); });
  }

  private loadInitialData(): void {
    showLoading();
    this.isLoading.set(true);
    forkJoin({ activos: this.activoService.obtenerActivos(this.requestFilters()), categorias: this.categoriaService.obtenerCategorias() })
      .pipe(finalize(() => { this.isLoading.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: ({ activos, categorias }) => { this.setPage(activos); this.categorias.set(categorias); }, error: (error: unknown) => showNotifyError('No fue posible cargar los activos.', error) });
  }

  private loadActivos(): void {
    showLoading(); this.isLoading.set(true);
    this.activoService.obtenerActivos(this.requestFilters()).pipe(finalize(() => { this.isLoading.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: page => this.setPage(page), error: (error: unknown) => showNotifyError('No fue posible cargar los activos.', error) });
  }

  private requestFilters(): ActivoFilters {
    const filters = this.filtersForm.getRawValue();
    return {
      numeroSerie: filters.numeroSerie ?? undefined,
      marcaModelo: filters.marcaModelo ?? undefined,
      categoriaId: filters.categoriaId ?? undefined,
      estado: filters.estado ?? undefined,
      costoMin: filters.costoMin ?? undefined,
      costoMax: filters.costoMax ?? undefined,
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort
    };
  }
  private setPage(page: { content: Activo[]; totalElements: number; number: number; size: number }): void { this.activos.set(page.content); this.totalElements.set(page.totalElements); this.pageIndex = page.number; this.pageSize = page.size; }
}
