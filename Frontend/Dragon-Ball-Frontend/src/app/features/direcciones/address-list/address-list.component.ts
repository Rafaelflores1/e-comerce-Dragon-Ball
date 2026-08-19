import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importamos el servicio con el nombre correcto que vimos antes
import { DireccionesService } from '../../../shared/services/direcciones-service'; 
import { Idireccion } from '../../../shared/interfaces/idireccion';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  
  // Signals para gestionar el estado
  direcciones = signal<Idireccion[]>([]);
  loading = signal<boolean>(true);

  // Inyectamos el servicio
  private direccionesService = inject(DireccionesService);

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  // Función asíncrona para traer los datos reales
  async cargarDirecciones() {
    this.loading.set(true); // Mostramos el spinner

    try {
      // Llamamos al servicio para obtener la lista desde el backend
      const datosReales = await this.direccionesService.getDirecciones();
      this.direcciones.set(datosReales); // Actualizamos el signal con los datos reales
    } catch (error) {
      console.error('Error al cargar las direcciones:', error);
      // Si falla, al menos dejamos el array vacío
      this.direcciones.set([]);
    } finally {
      this.loading.set(false); // Ocultamos el spinner
    }
  }

  async eliminarDireccion(id?: number) {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      try {
        // Aquí iría la llamada futura a tu backend para borrar:
        // await this.direccionesService.eliminarDireccion(id);

        // Actualizamos la vista eliminando del signal el ID borrado
        this.direcciones.update(lista => lista.filter(d => d.id !== id));
      } catch (error) {
        console.error('Error al eliminar la dirección:', error);
      }
    }
  }
}
