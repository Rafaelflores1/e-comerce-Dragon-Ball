import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  async onSubmit(): Promise<void> {
  if (!this.email || !this.password) {
    this.errorMessage.set('Por favor, ingresa correo y contraseña.');
    return;
  }

  this.isLoading.set(true);
  this.errorMessage.set('');

  try {
    const response = await this.authService.login({ email: this.email, password: this.password });
    this.isLoading.set(false);
    if (response.usuario?.rol === 'admin') {
      this.router.navigate(['/panel-admin']); 
    } else {
      this.router.navigate(['/productos']);
    }
  } catch (err: any) {
    this.isLoading.set(false);
    this.errorMessage.set(err.error?.mensaje || 'Credenciales incorrectas.');
  }
}
}