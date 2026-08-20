import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Ipedido } from '../interfaces/ipedido';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pedidos`;

  /**
   * Envía la orden de compra al Backend
   */
  async crearPedido(pedido: Ipedido): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(this.apiUrl, pedido)
    );
  }

  /**
   * Obtiene el historial de pedidos del usuario autenticado
   */
  async getMisPedidos(): Promise<Ipedido[]> {
    return await firstValueFrom(
      this.http.get<Ipedido[]>(`${this.apiUrl}/mis-pedidos`)
    );
  }
}