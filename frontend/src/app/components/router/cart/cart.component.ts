import { Component, OnInit } from '@angular/core';
import { CartService } from './../../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  get cart() {
    return this.cartService.cart;
  }

  constructor(
    private cartService: CartService
  ) {
    //this.cart = this.cartService.cart;
  }

  ngOnInit(): void {
    
  }

}
