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

  constructor(
    private cartService: CartService
  ) {
    const subs = this.cartService.getObs().subscribe(
      resCart => {
        this.cart = resCart;
        subs.unsubscribe();
      }
    )
  }

  ngOnInit(): void {
    
  }

  onQtyEmit(emitData: {product: Product, qty: any}) {
    this.cartService.addToCart(emitData.product, emitData.qty);
  }

  onDeleteEmit(product: Product) {
    this.cartService.removeItem(product.productId);
    this.cart = this.cartService.cart;
  }


}
