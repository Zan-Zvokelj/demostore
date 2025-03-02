import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './cart/cart.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent }, // Ensure 'home' exists
  { path: 'cart', component: CartComponent }, // Ensure 'cart' exists
  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];
