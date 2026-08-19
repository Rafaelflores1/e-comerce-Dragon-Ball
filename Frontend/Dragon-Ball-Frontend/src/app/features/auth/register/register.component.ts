import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  async onSubmit(): Promise<void> {
    if (!this.nombre || !this.email || !this.password) {
      this.errorMessage.set('Por favor, rellena todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.register({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
      });

      this.isLoading.set(false);
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      this.isLoading.set(false);
      this.errorMessage.set(
        err.error?.mensaje || 'Error al registrar la cuenta.'
      );
    }
  }
}
