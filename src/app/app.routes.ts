import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/login/login';
import { SearchComponent } from './features/seeker/search/search';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },

  // Protected Routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'search', component: SearchComponent },
      {
        path: 'provider/:id',
        loadComponent: () => import('./features/seeker/provider-detail/provider-detail')
          .then(m => m.ProviderDetailComponent)
      },
      { path: 'appointments', loadComponent: () => import('./features/appointments/list/list').then(m => m.ListComponent) }
    ]
  },

  { path: '**', redirectTo: 'login' }
];