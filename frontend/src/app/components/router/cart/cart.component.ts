import { Component, OnInit } from '@angular/core';
import { CartService } from './../../../services/cart/cart.service';
import { Product } from './../../../services/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Product[];
  amount: any;

  constructor(
    private cartService: CartService
  ) {
    const subs = this.cartService.getObs().subscribe(
      resCart => {
        this.cart = resCart;
        this.setAmount();
        subs.unsubscribe();
      }
    )
  }

  ngOnInit(): void {
    
  }

  onQtyEmit(emitData: {product: Product, qty: any}) {
    this.cartService.addToCart(emitData.product, emitData.qty);
    this.setAmount();
  }

  onDeleteEmit(product: Product) {
    this.cartService.removeItem(product.productId);
    this.cart = this.cartService.cart;
    this.setAmount();
  }

  setAmount() {
    this.amount = this.cartService.calcAmount();
  }

}
