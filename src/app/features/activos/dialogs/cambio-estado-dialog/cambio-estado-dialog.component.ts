import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { Activo, EstadoActivo } from '../../../../core/models/activo.model';
import { ActivoService } from '../../../../core/services/activo.service';
import { estadoChipClass, estadoLabel, estadosDestinoValidos } from '../../../../shared/utils/estado.util';
import { showLoading, showNotifyError, showNotifySuccess } from '../../../../shared/utils/sweetalert';

@Component({
  selector: 'app-cambio-estado-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './cambio-estado-dialog.component.html',
  styleUrl: './cambio-estado-dialog.component.scss'
})
export class CambioEstadoDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CambioEstadoDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly activoService = inject(ActivoService);
  private readonly destroyRef = inject(DestroyRef);
  readonly activo = inject<Activo>(MAT_DIALOG_DATA);

  readonly estadosDisponibles: EstadoActivo[] = estadosDestinoValidos(this.activo.estado);
  readonly isSaving = signal(false);
  readonly form = this.formBuilder.group({ nuevoEstado: [null as EstadoActivo | null] });

  readonly estadoLabel = estadoLabel;
  readonly estadoChipClass = estadoChipClass;

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    const nuevoEstado = this.form.value.nuevoEstado;
    if (!nuevoEstado) return;

    showLoading();
    this.isSaving.set(true);
    this.activoService.cambiarEstado(this.activo.identificadorTecnico, { estado: nuevoEstado })
      .pipe(finalize(() => { this.isSaving.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void showNotifySuccess('Estado actualizado correctamente.');
          this.dialogRef.close(true);
        },
        error: (error: unknown) => showNotifyError('No fue posible actualizar el estado.', error)
      });
  }
}
