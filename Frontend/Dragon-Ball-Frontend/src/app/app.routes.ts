import { Routes } from '@angular/router';
import { authGuardTsGuard } from './core/guards/auth.guard.ts-guard';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PanelAdminComponent } from './features/admin/panel-admin/panel-admin.component';
import { adminGuard } from './core/guards/admin-guard-guard';
import { ProductListComponent } from './features/productos/product-list/product-list.component';
import { AddressListComponent } from './features/direcciones/address-list/address-list.component';
import { AddressForm } from './features/direcciones/address-form/address-form';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },

  {
    path: 'productos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/productos/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/productos/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },
    ],
  },

  {
  path: 'checkout',
  loadComponent: () => import('./features/pedidos/checkout/checkout.component').then(m => m.CheckoutComponent)
},
  {
    path: 'direcciones',
    canActivate: [authGuardTsGuard],
    loadComponent: () =>
      import('./features/direcciones/address-list/address-list.component').then(
        (m) => m.AddressListComponent,
      ),
  },
  
  { path: 'direcciones/nueva', component: AddressForm },
  {
    path: 'perfil',
  component: PerfilComponent,
  canActivate: [authGuardTsGuard] 
  },

  { 
    path: 'panel-admin', 
    component: PanelAdminComponent, 
    canActivate: [adminGuard] 
  },



  // Redirección para rutas no encontradas
  { path: '**', redirectTo: 'productos' },
];
