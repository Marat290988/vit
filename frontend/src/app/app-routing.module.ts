import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/router/cart/cart.component';
import { OrdersComponent } from './components/router/orders/orders.component';
import { ProfileComponent } from './components/router/profile/profile.component';
import { VitsComponent } from './components/router/vits/vits.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './components/router/admin/admin-panel/admin-panel.component';
import { VitCardDetailsComponent } from './components/router/vits/vit-card-details/vit-card-details.component';

const routes: Routes = [
  { path: '', component: VitsComponent },
  {
    path: 'details',
    component: VitCardDetailsComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders', 
    component: OrdersComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  { 
    path: 'cart',
    component: CartComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin-panel',
    component: AdminPanelComponent,
    loadChildren: () => import('./components/router/admin/admin.module')
      .then(module => module.AdminModule),
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
