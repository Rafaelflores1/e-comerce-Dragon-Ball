import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Iusuario, IAuthResponse } from '../../shared/interfaces/iusuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private router = inject(Router);


  public currentUserSignal = signal<Iusuario | null>(this.getUserFromStorage());


  async register(userData: Iusuario): Promise<IAuthResponse> {
    return await firstValueFrom(
      this.http.post<IAuthResponse>(`${this.apiUrl}/register`, userData)
    );
  }

  async login(credentials: { email: string; password: string }): Promise<IAuthResponse> {
    const response = await firstValueFrom(
      this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credentials)
    );

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      this.currentUserSignal.set(response.usuario);
    }

    return response;
  }

 
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  private getUserFromStorage(): Iusuario | null {
    const userJson = localStorage.getItem('usuario');
    
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
      return null;
    }

    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error al parsear el usuario de localStorage', error);
      localStorage.removeItem('usuario');
      return null;
    }
  }
}