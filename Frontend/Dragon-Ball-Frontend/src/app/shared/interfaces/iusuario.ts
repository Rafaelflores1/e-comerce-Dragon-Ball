export interface Iusuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol?: string;
}

export interface IAuthResponse {
  token: string;
  usuario: Iusuario;
  mensaje?: string;
}