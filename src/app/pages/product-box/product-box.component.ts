import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-product-box',
  imports: [MatCard, CurrencyPipe, MatIcon, CommonModule, CurrencyPipe],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  constructor() {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
