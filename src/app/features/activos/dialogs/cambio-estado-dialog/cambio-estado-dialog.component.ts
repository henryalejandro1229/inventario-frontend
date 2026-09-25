import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Activo, EstadoActivo } from '../../../../core/models/activo.model';
import {
  estadoChipClass,
  estadoDotClass,
  estadoLabel,
  estadosDestinoValidos,
} from '../../../../shared/utils/estado.util';

export interface CambioEstadoDialogResult {
  activoId: string;
  estado: EstadoActivo;
}

@Component({
  selector: 'app-cambio-estado-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './cambio-estado-dialog.component.html',
  styleUrl: './cambio-estado-dialog.component.scss',
})
export class CambioEstadoDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<CambioEstadoDialogComponent>,
  );
  private readonly formBuilder = inject(FormBuilder);
  readonly activo = inject<Activo>(MAT_DIALOG_DATA);

  readonly estadosDisponibles: EstadoActivo[] = estadosDestinoValidos(
    this.activo.estado,
  );
  readonly form = this.formBuilder.group({
    nuevoEstado: [null as EstadoActivo | null],
  });

  readonly estadoLabel = estadoLabel;
  readonly estadoDotClass = estadoDotClass;
  readonly estadoChipClass = estadoChipClass;

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    const nuevoEstado = this.form.value.nuevoEstado;
    if (!nuevoEstado) return;

    this.dialogRef.close({
      activoId: this.activo.identificadorTecnico,
      estado: nuevoEstado,
    } satisfies CambioEstadoDialogResult);
  }
}
