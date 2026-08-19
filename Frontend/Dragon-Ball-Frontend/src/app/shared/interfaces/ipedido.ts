export interface IDetallePedido {
  id?:number
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  nombre?: string;
  imagen_url?: string;
}

export interface Ipedido {
  id?: number;
  usuario_id?: number;
  total: number;
  fecha_pedido?: string
  direccion_envio?: string;
  metodo_pago?: string;
  estado?: string;
  detalles?: IDetallePedido[];
  productos?: IDetallePedido[];
  created_at?: string;
}