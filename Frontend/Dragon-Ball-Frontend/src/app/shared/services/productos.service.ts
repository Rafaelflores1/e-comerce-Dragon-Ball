import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  IProducto, 
  Categoria, 
  Saga, 
  ProductosResponse, 
  FiltrosProductos 
} from '../../shared/interfaces/iproducto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private http = inject(HttpClient);
  private apiUrl = 'e-comerce-dragon-ball-production.up.railway.app/api';

  // Signals de estado
  productosSignal = signal<IProducto[]>([]);
  totalProductosSignal = signal<number>(0);
  loadingSignal = signal<boolean>(false);
  categoriasSignal = signal<Categoria[]>([]);
  sagasSignal = signal<Saga[]>([]);
  pageSize = signal<number>(10); // Elementos por página
 currentPage = signal<number>(1);   // Página actual

  // Obtener catálogo
  async getProductos(filtros: FiltrosProductos = {}): Promise<ProductosResponse> {
  this.loadingSignal.set(true);

  let params = new HttpParams();
  if (filtros.categoria_id) params = params.set('categoria_id', filtros.categoria_id.toString());
  if (filtros.saga_id) params = params.set('saga_id', filtros.saga_id.toString());
  if (filtros.nombre) params = params.set('nombre', filtros.nombre);
  if (filtros.limit) params = params.set('limit', filtros.limit.toString());
  if (filtros.offset) params = params.set('offset', filtros.offset.toString());

  try {
    const res = await firstValueFrom(
      this.http.get<ProductosResponse>(`${this.apiUrl}/productos`, { params })
    );

    const lista = res.productos || [];
    this.productosSignal.set(lista);
    // Si res.total es undefined, asigna el tamaño de la lista obtenida
    this.totalProductosSignal.set(res.total ?? lista.length);

    return res;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    this.productosSignal.set([]);
    this.totalProductosSignal.set(0);
    throw error;
  } finally {
    this.loadingSignal.set(false);
  }
}

  // Detalle de un producto
  async getProductoById(id: number): Promise<IProducto> {
    return await firstValueFrom(
      this.http.get<IProducto>(`${this.apiUrl}/productos/${id}`)
    );
  }

  // Cargar Categorías
  async getCategorias(): Promise<Categoria[]> {
    const cats = await firstValueFrom(
      this.http.get<Categoria[]>(`${this.apiUrl}/categorias`)
    );
    this.categoriasSignal.set(cats);
    return cats;
  }

  // Cargar Sagas
  async getSagas(): Promise<Saga[]> {
    const sagas = await firstValueFrom(
      this.http.get<Saga[]>(`${this.apiUrl}/sagas`)
    );
    this.sagasSignal.set(sagas);
    return sagas;
  }

  // --- MÉTODOS CRUD PARA EL PANEL DE ADMINISTRACIÓN ---

  // Crear Producto
  async createProducto(productoData: FormData): Promise<IProducto> {
    return await firstValueFrom(
      this.http.post<IProducto>(`${this.apiUrl}/productos`, productoData)
    );
  }

  // Actualizar Producto
  async updateProducto(id: number, productoData: FormData): Promise<IProducto> {
    return await firstValueFrom(
      this.http.put<IProducto>(`${this.apiUrl}/productos/${id}`, productoData)
    );
  }

  // Eliminar Producto
  async deleteProducto(id: number): Promise<void> {
    return await firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/productos/${id}`)
    );
  }
  async getProductosAdmin(): Promise<void> {
  const productos = await firstValueFrom(
    this.http.get<IProducto[]>(`${this.apiUrl}/productos/all`) // Asegúrate de que esta ruta en tu backend apunte al controlador 'getProducts'
  );
  this.productosSignal.set(productos);
}
async getProductosPaginados(limit: number, offset: number, filtros?: FiltrosProductos): Promise<void> {
    const params: any = { limit, offset };
    
    if (filtros?.categoria_id) params.categoria_id = filtros.categoria_id;
    if (filtros?.saga_id) params.saga_id = filtros.saga_id;
    if (filtros?.nombre) params.nombre = filtros.nombre;

    const res = await firstValueFrom(
      this.http.get<ProductosResponse>(`${this.apiUrl}/productos`, { params })
    );
    
    this.productosSignal.set(res.productos);
    this.totalProductosSignal.set(res.total);
  }

}