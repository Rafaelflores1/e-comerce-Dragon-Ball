import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// 1. Ruta correcta según tu explorador de archivos:
import { DireccionesService } from '../../../shared/services/direcciones-service'; 

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // 2. Quitamos el '.component' porque tus archivos se llaman sin ello:
  templateUrl: './address-form.html',
  styleUrls: ['./address-form.css']
})
export class AddressForm {
  
  private router = inject(Router);
  // 3. Minúscula para que coincida con el uso:
  private direccionesService = inject(DireccionesService);

  nuevaDireccion = {
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    pais: ''
  };

  isSaving = signal<boolean>(false);

  async guardarDireccion() {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    console.log('Enviando dirección al backend:', this.nuevaDireccion);

    try {
      // 4. Usamos la propiedad en minúscula:
      const response = await this.direccionesService.crearDireccion(this.nuevaDireccion);
      
      console.log('Dirección creada con éxito:', response);
      alert('¡Dirección guardada correctamente!');
      this.router.navigate(['/direcciones']);
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      alert('Hubo un error al guardar la dirección. Revisa la consola.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
