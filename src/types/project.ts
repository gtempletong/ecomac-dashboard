export interface Project {
  proyecto: string;
  ciudad: string;
  edificios: number;
  pisos: number;
  uh_totales: number;
  estacionamientos: number;
  avance_ventas: number;
  avance_obra: number;
  tir?: number;
  dividendos?: number;
}

export interface Sector {
  sector: string;
  cantidad: number;
  porcentaje: number;
  ventas: number;
  stock: number;
}

