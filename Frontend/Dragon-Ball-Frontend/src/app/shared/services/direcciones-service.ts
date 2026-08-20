import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Idireccion } from '../../shared/interfaces/idireccion';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {
  private http = inject(HttpClient);
  private apiUrl = 'e-comerce-dragon-ball-production.up.railway.app/api/direcciones';

  // Convertimos la llamada a una Promesa
  async crearDireccion(direccion: Omit<Idireccion, 'id'>): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(this.apiUrl, direccion));
      return response;
    } catch (error) {
      console.error('Error en el servicio al crear dirección:', error);
      throw error; // Lanza el error para capturarlo en el componente
    }
  }

  // Ya que estamos, también puedes dejar preparado el método de listar con Promesas
  // Método para listar direcciones usando promesas
  async getDirecciones(): Promise<Idireccion[]> {
    try {
      // Petición GET a tu backend
      return await firstValueFrom(this.http.get<Idireccion[]>(this.apiUrl));
    } catch (error) {
      console.error('Error en el servicio al obtener direcciones:', error);
      throw error;
    }
  }
}
