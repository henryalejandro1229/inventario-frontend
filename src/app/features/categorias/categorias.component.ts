import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { showLoading, showNotifyError } from '../../shared/utils/sweetalert';

@Component({
  selector: 'app-categorias',
  imports: [MatCardModule, MatIconModule, MatTableModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  private readonly categoriaService = inject(CategoriaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = ['nombre', 'codigoPrefijo'];
  readonly categorias = signal<Categoria[]>([]);
  readonly isLoading = signal(false);

  constructor() { this.loadCategorias(); }

  private loadCategorias(): void {
    showLoading();
    this.isLoading.set(true);
    this.categoriaService.obtenerCategorias()
      .pipe(finalize(() => { this.isLoading.set(false); showLoading(false); }), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (categorias) => this.categorias.set(categorias), error: (error: unknown) => showNotifyError('No fue posible cargar las categorías.', error) });
  }
}
