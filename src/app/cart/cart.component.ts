import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    HttpClientModule,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  dataSource: CartItem[] = [];
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      console.log('Updated Cart:', _cart.items);
      this.cart = _cart;
      this.dataSource = _cart.items;
    });
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout(): void {
    this.http
      .post('https://demostore.herokuapp.com/checkout', {
        items: this.cart.items,
      })
      .subscribe(
        async (res: any) => {
          console.log('Stripe Checkout Response:', res); // Log the response

          if (!res || !res.id) {
            console.error('Error: Checkout session ID is missing!', res);
            return;
          }

          try {
            let stripe = await loadStripe(
              'pk_test_51QxAhvH02qXfvY4xJbeW3AXLBuxkv3s93rjjUmuH7qVZ9jW8tFMwyvF75PW57Nrs5KUwBncR6ZDYuyRMMAS7jU6S00JqubpwOC'
            );

            if (!stripe) {
              console.error('Error: Stripe failed to initialize!');
              return;
            }

            const { error } = await stripe.redirectToCheckout({
              sessionId: res.id,
            });

            if (error) {
              console.error('Stripe Checkout Error:', error);
            }
          } catch (err) {
            console.error('Error during Stripe checkout:', err);
          }
        },
        (error) => {
          console.error('Error sending checkout request:', error);
        }
      );

    console.log('Proceeding to checkout with items:', this.cart.items);
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
