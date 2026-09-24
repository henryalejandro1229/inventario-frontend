export type EstadoActivo = 'DISPONIBLE' | 'ASIGNADO' | 'EN_MANTENIMIENTO' | 'BAJA';

export interface Activo {
  identificadorTecnico: string;
  folioInventario: string;
  numeroSerie: string;
  marcaModelo: string;
  estado: EstadoActivo;
  costoAdquisicion: number;
  fechaIngreso: string;
  categoriaId: number;
  categoriaNombre: string;
}

export interface ActivoFilters {
  numeroSerie?: string;
  marcaModelo?: string;
  categoriaId?: number;
  estado?: EstadoActivo;
  costoMin?: number;
  costoMax?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ActivoRequest {
  numeroSerie: string;
  marcaModelo: string;
  estado?: EstadoActivo;
  costoAdquisicion: number;
  categoriaId: number;
}

export interface CambioEstadoRequest {
  estado: EstadoActivo;
}
