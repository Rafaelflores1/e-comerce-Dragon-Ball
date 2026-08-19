import { computed, Injectable, signal } from '@angular/core';
import { IProducto } from '../interfaces/iproducto';
import { IDetallePedido } from '../interfaces/ipedido';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemsSignal = signal<IDetallePedido[]>(this.loadCartFromStorage());

  // Signal derivada: Total de items en el carrito
  totalItems = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + item.cantidad, 0)
  );

  // Signal derivada: Precio total de la compra
  totalAmount = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0)
  );

  // Agregar producto al carrito
  addToCart(producto: IProducto, cantidad: number = 1): void {
    const currentItems = this.cartItemsSignal();
    const existingIndex = currentItems.findIndex(i => i.producto_id === producto.id);

    let updatedCart: IDetallePedido[];

    if (existingIndex > -1) {
      updatedCart = [...currentItems];
      updatedCart[existingIndex].cantidad += cantidad;
    } else {
      const newItem: IDetallePedido = {
        producto_id: producto.id,
        cantidad,
        precio_unitario: producto.precio,
        nombre: producto.nombre,
        imagen_url: producto.imagen_url
      };
      updatedCart = [...currentItems, newItem];
    }

    this.updateCart(updatedCart);
  }

  // Eliminar producto del carrito
  removeFromCart(productoId: number): void {
    const updatedCart = this.cartItemsSignal().filter(i => i.producto_id !== productoId);
    this.updateCart(updatedCart);
  }

  // Cambiar cantidad de un producto
  updateQuantity(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removeFromCart(productoId);
      return;
    }

    const updatedCart = this.cartItemsSignal().map(item => 
      item.producto_id === productoId ? { ...item, cantidad } : item
    );
    this.updateCart(updatedCart);
  }

  // Vaciar carrito
  clearCart(): void {
    this.updateCart([]);
  }

  // Métodos auxiliares de persistencia
  private updateCart(items: IDetallePedido[]): void {
    this.cartItemsSignal.set(items);
    localStorage.setItem('shopping_cart', JSON.stringify(items));
  }

  private loadCartFromStorage(): IDetallePedido[] {
    const savedCart = localStorage.getItem('shopping_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
}
