/**
 * Tipos de Base de Datos - Sistema ECOMAC
 * Generados a partir del schema de Supabase
 */

// =====================================================
// TIPOS BASE
// =====================================================

export type TipoFondo = 'FIP' | 'POOL' | 'OTRO';
export type EstadoFondo = 'ACTIVO' | 'CERRADO' | 'LIQUIDACION';
export type EstadoSubyacente = 'VIGENTE' | 'SALIDA' | 'LIQUIDADO';
export type TipoAportante = 'PERSONA' | 'EMPRESA' | 'AFP' | 'COMPAÑIA_SEGUROS' | 'OTRO';
export type EstadoCompromiso = 'VIGENTE' | 'CANCELADO' | 'COMPLETADO';
export type TipoLlamadoReparto = 'PROYECTADO' | 'EJECUTADO';
export type EstadoLlamado = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'VENCIDO';
export type EstadoAporte = 'PENDIENTE' | 'PAGADO' | 'PAGO_PARCIAL' | 'MORA' | 'INCUMPLIMIENTO';
export type EstadoReparto = 'PENDIENTE' | 'EJECUTADO';
export type EstadoRepartoIndividual = 'PENDIENTE' | 'PAGADO';

// =====================================================
// INTERFACES DE ENTIDADES
// =====================================================

export interface Fondo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoFondo;
  fecha_constitucion: string | null;
  fecha_termino_estimada: string | null;
  monto_objetivo_uf: number;
  monto_comprometido_uf: number;
  monto_aportado_uf: number;
  tir_objetivo: number | null;
  tir_actual: number | null;
  estado: EstadoFondo;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subyacente {
  id: string;
  fondo_id: string;
  nombre: string;
  inmobiliaria: string | null;
  comuna: string | null;
  region: string | null;
  operacion: string | null;
  monto_operacion_uf: number | null;
  moneda: string;
  uh_totales: number;
  uh_vendidas: number;
  uh_stock: number;
  avance_ventas: number | null;
  fecha_inicio_obra: string | null;
  fecha_fin_obra: string | null;
  fecha_salida_fondo: string | null;
  inversion_uf: number | null;
  van_uf: number | null;
  estado: EstadoSubyacente;
  created_at: string;
  updated_at: string;
}

export interface Aportante {
  id: string;
  rut: string;
  nombre: string;
  tipo: TipoAportante;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  representante_legal: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Compromiso {
  id: string;
  fondo_id: string;
  aportante_id: string;
  monto_comprometido_uf: number;
  porcentaje_participacion: number;
  fecha_compromiso: string;
  estado: EstadoCompromiso;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface LlamadoCapital {
  id: string;
  fondo_id: string;
  numero_llamado: number;
  periodo: string | null;
  fecha_llamado: string;
  fecha_vencimiento: string | null;
  monto_total_uf: number;
  tipo: TipoLlamadoReparto;
  estado: EstadoLlamado;
  motivo: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface AporteIndividual {
  id: string;
  llamado_id: string;
  aportante_id: string;
  monto_solicitado_uf: number;
  monto_aportado_uf: number;
  fecha_pago: string | null;
  estado: EstadoAporte;
  forma_pago: string | null;
  comprobante: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reparto {
  id: string;
  fondo_id: string;
  numero_reparto: number;
  periodo: string | null;
  fecha_reparto: string;
  monto_total_uf: number;
  tipo: TipoLlamadoReparto;
  estado: EstadoReparto;
  origen: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepartoIndividual {
  id: string;
  reparto_id: string;
  aportante_id: string;
  monto_uf: number;
  fecha_pago: string | null;
  estado: EstadoRepartoIndividual;
  forma_pago: string | null;
  comprobante: string | null;
  retencion_impuestos: number | null;
  monto_neto_uf: number | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// INTERFACES DE VISTAS (con JOINs)
// =====================================================

export interface ResumenFondo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoFondo;
  monto_objetivo_uf: number;
  monto_comprometido_uf: number;
  monto_aportado_uf: number;
  tir_objetivo: number | null;
  tir_actual: number | null;
  estado: EstadoFondo;
  num_subyacentes: number;
  num_aportantes: number;
  inversion_total_uf: number;
}

export interface ResumenLlamado {
  id: string;
  fondo_id: string;
  fondo_nombre: string;
  numero_llamado: number;
  periodo: string | null;
  fecha_llamado: string;
  fecha_vencimiento: string | null;
  monto_total_uf: number;
  tipo: TipoLlamadoReparto;
  estado: EstadoLlamado;
  num_aportantes: number;
  total_solicitado: number;
  total_aportado: number;
  num_pagados: number;
  num_pendientes: number;
}

export interface EstadoAportante {
  aportante_id: string;
  aportante_nombre: string;
  rut: string;
  tipo: TipoAportante;
  fondo_id: string;
  fondo_nombre: string;
  monto_comprometido_uf: number;
  porcentaje_participacion: number;
  total_aportado: number;
  total_repartos_recibidos: number;
  estado_compromiso: EstadoCompromiso;
}

// =====================================================
// INTERFACES CON RELACIONES (para queries expandidas)
// =====================================================

export interface FondoConRelaciones extends Fondo {
  subyacentes?: Subyacente[];
  compromisos?: CompromisoConAportante[];
  llamados_capital?: LlamadoCapitalConAportes[];
  repartos?: RepartoConIndividuales[];
}

export interface CompromisoConAportante extends Compromiso {
  aportante?: Aportante;
}

export interface LlamadoCapitalConAportes extends LlamadoCapital {
  aportes_individuales?: AporteIndividualConAportante[];
}

export interface AporteIndividualConAportante extends AporteIndividual {
  aportante?: Aportante;
}

export interface RepartoConIndividuales extends Reparto {
  repartos_individuales?: RepartoIndividualConAportante[];
}

export interface RepartoIndividualConAportante extends RepartoIndividual {
  aportante?: Aportante;
}

export interface SubyacenteConFondo extends Subyacente {
  fondo?: Fondo;
}

// =====================================================
// TIPOS PARA FORMULARIOS (Insert/Update)
// =====================================================

export type FondoInsert = Omit<Fondo, 'id' | 'created_at' | 'updated_at'>;
export type FondoUpdate = Partial<FondoInsert>;

export type SubyacenteInsert = Omit<Subyacente, 'id' | 'created_at' | 'updated_at'>;
export type SubyacenteUpdate = Partial<SubyacenteInsert>;

export type AportanteInsert = Omit<Aportante, 'id' | 'created_at' | 'updated_at'>;
export type AportanteUpdate = Partial<AportanteInsert>;

export type CompromisoInsert = Omit<Compromiso, 'id' | 'created_at' | 'updated_at'>;
export type CompromisoUpdate = Partial<CompromisoInsert>;

export type LlamadoCapitalInsert = Omit<LlamadoCapital, 'id' | 'created_at' | 'updated_at'>;
export type LlamadoCapitalUpdate = Partial<LlamadoCapitalInsert>;

export type AporteIndividualInsert = Omit<AporteIndividual, 'id' | 'created_at' | 'updated_at'>;
export type AporteIndividualUpdate = Partial<AporteIndividualInsert>;

export type RepartoInsert = Omit<Reparto, 'id' | 'created_at' | 'updated_at'>;
export type RepartoUpdate = Partial<RepartoInsert>;

export type RepartoIndividualInsert = Omit<RepartoIndividual, 'id' | 'created_at' | 'updated_at'>;
export type RepartoIndividualUpdate = Partial<RepartoIndividualInsert>;

// =====================================================
// TIPOS PARA DASHBOARD Y ANALYTICS
// =====================================================

export interface MetricasFondo {
  fondo: Fondo;
  porcentaje_comprometido: number; // % del objetivo
  porcentaje_aportado: number;     // % del comprometido
  total_llamados: number;
  total_repartos: number;
  roi_actual: number;              // Return on Investment
  multiple: number;                // Repartos / Aportes
}

export interface FlujoCaja {
  periodo: string;
  fecha: string;
  tipo: 'LLAMADO' | 'REPARTO';
  monto_uf: number;
  acumulado_uf: number;
  descripcion?: string;
}

export interface TIRHistorico {
  fecha: string;
  tir: number;
  periodo?: string;
}

export interface DashboardData {
  fondos: ResumenFondo[];
  total_fondos: number;
  capital_total_comprometido: number;
  capital_total_aportado: number;
  tir_promedio: number;
  num_aportantes_unicos: number;
  num_subyacentes_activos: number;
}

// =====================================================
// TIPOS PARA FILTROS Y BÚSQUEDAS
// =====================================================

export interface FondosFiltros {
  tipo?: TipoFondo[];
  estado?: EstadoFondo[];
  tir_min?: number;
  tir_max?: number;
  search?: string;
}

export interface LlamadosFiltros {
  fondo_id?: string;
  estado?: EstadoLlamado;
  tipo?: TipoLlamadoReparto[];
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface AportantesFiltros {
  tipo?: TipoAportante[];
  activo?: boolean;
  fondo_id?: string;
  search?: string;
}

// =====================================================
// TIPOS DE RESPUESTA DE API
// =====================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


