import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from './../../../services/cart/cart.service';
import { Product } from './../../../services/product/product.service';
import { Big } from 'big.js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Product[];
  amount: any;
  shipping = '';
  total:any = '';
  @ViewChild('in1') in1: ElementRef;
  @ViewChild('in2') in2: ElementRef;
  @ViewChild('in3') in3: ElementRef;
  @ViewChild('in4') in4: ElementRef;

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
    if (this.amount) {
      this.shipping = new Big(this.amount).times(10).div(100).toFixed(2);
      this.total = new Big(this.amount).plus(this.shipping).toFixed(2);
    } else {
      this.total = '';
      this.shipping = '';
      this.amount = null;
    }
  }

  blockNotNumeric(event, inputEl: HTMLInputElement) {
    let checkValue: string = event.target.value;
    let lastInput = event.data;
    if (lastInput !== null && lastInput.match(/[0-9]/) === null) {
      event.target.value = checkValue.slice(0, checkValue.length-1);
    }
    if (checkValue.length === 4 && inputEl !== null) {
      inputEl.focus();
    } else if (checkValue.length === 5 && inputEl === null) {
      event.target.value = checkValue.slice(0, checkValue.length-1);
    } else if (checkValue.length === 5 && inputEl !== null) {
      event.target.value = checkValue.slice(0, checkValue.length-1);
    }
  }

  onFocus(inputEl: HTMLInputElement) {
    if (this.in1.nativeElement.value.length !== 4) {
      this.in1.nativeElement.focus();
      return;
    }
    // } else if (this.in2.nativeElement.value.length !== 4) {
    //   this.in2.nativeElement.focus();
    //   return;
    // } else if (this.in3.nativeElement.value.length !== 4) {
    //   this.in3.nativeElement.focus();
    //   return;
    // }
    // inputEl.focus();
  }

  isValid(): boolean {
    if (
      this.total !== '' &&
      this.in1 &&
      this.in1.nativeElement.value.length === 4 &&
      this.in2.nativeElement.value.length === 4 &&
      this.in3.nativeElement.value.length === 4 &&
      this.in4.nativeElement.value.length === 4
    ) {
      return true;
    } else {
      return false;
    }
  }

}
