export interface Categoria {
  id: number;
  nombre: string;
}

export interface Saga {
  id: number;
  nombre: string;
}

export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  categoria_id: number;
  saga_id: number;
}

export interface ProductosResponse {
  productos: IProducto[];
  total: number;
  limit: number;
  offset: number;
}

export interface FiltrosProductos {
  categoria_id?: number | null;
  saga_id?: number | null;
  nombre?: string;
  limit?: number;
  offset?: number;
}