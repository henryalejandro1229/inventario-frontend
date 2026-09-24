import { EstadoActivo } from '../../core/models/activo.model';

export const ESTADOS_ACTIVO: EstadoActivo[] = ['DISPONIBLE', 'ASIGNADO', 'EN_MANTENIMIENTO', 'BAJA'];

export function estadoLabel(estado: EstadoActivo): string {
  return estado.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function estadoChipClass(estado: EstadoActivo): string {
  return `state-chip state-${estado.toLowerCase()}`;
}

/**
 * Refleja la única regla de negocio real del backend: un activo en BAJA no puede
 * volver a un estado operativo. Es solo una ayuda visual; el backend sigue validando.
 */
export function estadosDestinoValidos(estadoActual: EstadoActivo): EstadoActivo[] {
  if (estadoActual === 'BAJA') return [];
  return ESTADOS_ACTIVO.filter((estado) => estado !== estadoActual);
}
