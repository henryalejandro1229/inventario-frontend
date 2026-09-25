import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstadoActivo } from '../../../../core/models/activo.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { ESTADOS_ACTIVO, estadoDotClass, estadoLabel } from '../../../../shared/utils/estado.util';

export interface ActivoFiltersDialogValues {
  numeroSerie: string;
  marcaModelo: string;
  categoriaId: number | null;
  estado: EstadoActivo | null;
  costoMin: number | null;
  costoMax: number | null;
}

export interface ActivoFiltersDialogData {
  categorias: Categoria[];
  filtros: ActivoFiltersDialogValues;
}

@Component({
  selector: 'app-activo-filters-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './activo-filters-dialog.component.html',
  styleUrl: './activo-filters-dialog.component.scss'
})
export class ActivoFiltersDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ActivoFiltersDialogComponent>);
  readonly data = inject<ActivoFiltersDialogData>(MAT_DIALOG_DATA);
  readonly estados = ESTADOS_ACTIVO;
  readonly estadoDotClass = estadoDotClass;
  readonly estadoLabel = estadoLabel;

  readonly form = this.formBuilder.group({
    numeroSerie: [this.data.filtros.numeroSerie ?? ''],
    marcaModelo: [this.data.filtros.marcaModelo ?? ''],
    categoriaId: [this.data.filtros.categoriaId ?? null as number | null],
    estado: [this.data.filtros.estado ?? null as EstadoActivo | null],
    costoMin: [this.data.filtros.costoMin ?? null as number | null],
    costoMax: [this.data.filtros.costoMax ?? null as number | null]
  });

  cerrar(): void {
    this.dialogRef.close();
  }

  limpiar(): void {
    this.form.reset({ numeroSerie: '', marcaModelo: '', categoriaId: null, estado: null, costoMin: null, costoMax: null });
  }

  aplicar(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
