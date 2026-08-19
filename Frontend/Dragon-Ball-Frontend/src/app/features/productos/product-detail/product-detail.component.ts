import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosService } from '../../../shared/services/productos.service';
import { CartService } from '../../../shared/services/cart.service';
import { IProducto } from '../../../shared/interfaces/iproducto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-detail',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);

  producto = signal<IProducto | null>(null);
  loading = signal<boolean>(true);
  cantidad = signal<number>(1);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      try {
        const prod = await this.productosService.getProductoById(id);
        this.producto.set(prod);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        this.loading.set(false);
      }
    }
  }

  addToCart(): void {
    const prod = this.producto();
    if (prod) {
      this.cartService.addToCart(prod, this.cantidad());
    }
  }
}
