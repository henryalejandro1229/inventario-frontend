import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { Activo, ActivoRequest, EstadoActivo } from '../../../../core/models/activo.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { ActivoService } from '../../../../core/services/activo.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { ESTADOS_ACTIVO, estadoDotClass, estadoLabel } from '../../../../shared/utils/estado.util';
import { showLoading, showNotifyError, showNotifySuccess } from '../../../../shared/Utilities';

@Component({
  selector: 'app-activo-form-dialog',
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './activo-form-dialog.component.html',
  styleUrl: './activo-form-dialog.component.scss'
})
export class ActivoFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ActivoFormDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly activoService = inject(ActivoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly activo = inject<Activo | null>(MAT_DIALOG_DATA);
  readonly isEditMode = this.activo !== null;
  readonly isSaving = signal(false);
  readonly categorias = signal<Categoria[]>([]);
  readonly estadosIniciales: EstadoActivo[] = ESTADOS_ACTIVO;
  readonly estadoDotClass = estadoDotClass;
  readonly estadoLabel = estadoLabel;

  readonly form = this.formBuilder.group({
    numeroSerie: [this.activo?.numeroSerie ?? '', [Validators.required, Validators.maxLength(100)]],
    marcaModelo: [this.activo?.marcaModelo ?? '', [Validators.required, Validators.maxLength(150)]],
    categoriaId: [this.activo?.categoriaId ?? null, Validators.required],
    costoAdquisicion: [this.activo?.costoAdquisicion ?? null, [Validators.required, Validators.min(0)]],
    estado: [this.activo?.estado ?? ('DISPONIBLE' as EstadoActivo)]
  });

  constructor() {
    this.categoriaService.obtenerCategorias().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (categorias) => this.categorias.set(categorias), error: (error: unknown) => showNotifyError('No fue posible cargar las categorías.', error) });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Los campos requeridos ya fueron validados arriba (form.invalid); los tipos de
    // Reactive Forms no reflejan esa garantía, de ahí las aserciones no-null.
    const value = this.form.getRawValue();
    const request: ActivoRequest = {
      numeroSerie: value.numeroSerie!,
      marcaModelo: value.marcaModelo!,
      categoriaId: value.categoriaId!,
      costoAdquisicion: value.costoAdquisicion!,
      ...(this.isEditMode ? {} : { estado: value.estado ?? undefined })
    };

    showLoading();
    this.isSaving.set(true);
    const activo = this.activo;
    const request$ = activo
      ? this.activoService.actualizar(activo.identificadorTecnico, request)
      : this.activoService.crear(request);

    request$.pipe(finalize(() => { this.isSaving.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void showNotifySuccess(this.isEditMode ? 'Activo actualizado correctamente.' : 'Activo creado correctamente.');
          this.dialogRef.close(true);
        },
        error: (error: unknown) => showNotifyError(this.isEditMode ? 'No fue posible actualizar el activo.' : 'No fue posible crear el activo.', error)
      });
  }
}
