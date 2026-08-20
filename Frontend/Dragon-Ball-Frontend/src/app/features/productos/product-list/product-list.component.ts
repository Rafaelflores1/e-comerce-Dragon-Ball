import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../shared/services/productos.service';
import { CartService } from '../../../shared/services/cart.service';
import { IProducto, FiltrosProductos } from '../../../shared/interfaces/iproducto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  public productosService = inject(ProductosService);
  private cartService = inject(CartService);

  // Filtros locales
  selectedCategoria = signal<number | null>(null);
  selectedSaga = signal<number | null>(null);
  searchQuery = signal<string>('');

  async ngOnInit(): Promise<void> {
  try {
    await Promise.allSettled([
      this.cargarPagina(1),
      this.productosService.getCategorias(),
      this.productosService.getSagas()
    ]);
  } catch (error) {
    console.error('Error al inicializar el catálogo:', error);
  }
}

getImagenUrl(imagenUrl: string | null | undefined): string {
  if (!imagenUrl) return 'assets/placeholder.png';
  
  const urlLimpia = imagenUrl.trim();

  if (urlLimpia.startsWith('http')) {
    return urlLimpia;
  }

  // Si ya empieza por /image/, lo dejamos así; si no, le anteponemos /image/
  if (urlLimpia.startsWith('/image/')) {
    return urlLimpia;
  }
  
  const rutaFinal = urlLimpia.startsWith('/') ? urlLimpia : '/' + urlLimpia;
  return `/image${rutaFinal}`;
}

  async cargarPagina(page: number): Promise<void> {
    const limit = this.productosService.pageSize();
    const offset = (page - 1) * limit;
    
    this.productosService.currentPage.set(page);

    // Empaquetamos los filtros actuales
    const filtros: FiltrosProductos = {
      categoria_id: this.selectedCategoria(),
      saga_id: this.selectedSaga(),
      nombre: this.searchQuery() || undefined
    };

    // ⚡ Pasamos los argumentos separados (limit, offset, filtros) a tu servicio
    await this.productosService.getProductosPaginados(limit, offset, filtros);
  }

  // Calcular el total de páginas disponibles
  get totalPages(): number {
    return Math.ceil(this.productosService.totalProductosSignal() / this.productosService.pageSize());
  }

  nextPage(): void {
    if (this.productosService.currentPage() < this.totalPages) {
      this.cargarPagina(this.productosService.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.productosService.currentPage() > 1) {
      this.cargarPagina(this.productosService.currentPage() - 1);
    }
  }

  async cargarProductos(): Promise<void> {
    const filtros: FiltrosProductos = {
      categoria_id: this.selectedCategoria(),
      saga_id: this.selectedSaga(),
      nombre: this.searchQuery() || undefined
    };
    await this.productosService.getProductos(filtros);
  }

  onFilterChange(): void {
    this.cargarProductos();
  }

  addToCart(producto: IProducto): void {
    this.cartService.addToCart(producto, 1);
  }
}