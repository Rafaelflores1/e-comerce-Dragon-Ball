import { Component, inject, signal } from '@angular/core';

import { CartService } from '../../../shared/services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { PedidosService } from '../../../shared/services/pedidos.services';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  private pedidosService = inject(PedidosService); // 👈 Inyectamos el servicio
  private router = inject(Router);

  isProcessing = signal<boolean>(false);
  direccionEnvio = ''; // 👈 Variable para vincular con [(ngModel)] en tu HTML

  updateQuantity(productoId: number, cantidad: number): void {
    this.cartService.updateQuantity(productoId, cantidad);
  }

  removeItem(productoId: number): void {
    this.cartService.removeFromCart(productoId);
  }

  metodoPago= 'Tarjeta de crédito'

  async procesarPedido(): Promise<void> {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/auth/login']);
    return;
  }

  if (this.cartService.cartItemsSignal().length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  this.isProcessing.set(true);

  // Mapeamos los items asegurándonos de enviar la estructura exacta de MySQL
  const itemsFormateados = this.cartService.cartItemsSignal().map(item => ({
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario
  }));

  const nuevoPedido = {
    total: this.cartService.totalAmount(),
    direccion_envio: this.direccionEnvio.trim() || 'Isla Kame House, Distrito 43', // 👈 Evita que viaje vacío o NULL
    metodo_pago: 'Tarjeta',
    detalles: itemsFormateados,
    productos: itemsFormateados
  };

  try {
    await this.pedidosService.crearPedido(nuevoPedido);
    this.cartService.clearCart();
    this.isProcessing.set(false);
    alert('¡Pedido realizado con éxito!');
    this.router.navigate(['/productos']);
  } catch (err: any) {
    this.isProcessing.set(false);
    console.error('Error del backend:', err);
    alert(err.error?.mensaje || err.error?.error || 'Error al procesar el pedido.');
  }
}
}