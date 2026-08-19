import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { Ipedido } from '../../shared/interfaces/ipedido';
import { PedidosService } from '../../shared/services/pedidos.services';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,NgClass,RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  public authService = inject(AuthService);
  private pedidosService = inject(PedidosService);

  pedidos = signal<Ipedido[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.pedidosService.getMisPedidos();
      this.pedidos.set(data);
    } catch (err: any) {
      console.error('Error al cargar pedidos:', err);
      this.errorMessage.set('No se pudieron obtener tus pedidos.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
