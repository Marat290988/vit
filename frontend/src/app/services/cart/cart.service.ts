import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Product } from './../product/product.service';
import { Big } from 'big.js';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart: Product[] = [];
    addEvent$ = new BehaviorSubject<number | any>(null);

    addToCart(product: Product, qty: string): void {
        let pIndex = null;
        this.cart.filter((i, index) => {
            if (i.productId === product.productId) {
                i.qty = String(Number.parseInt(i.qty) + Number.parseInt(qty));
                pIndex = index;
            };
        });
        if (pIndex === null) {
            this.cart.push({...product, qty});
        }
        this.addEvent$.next(this.goodCount(this.cart));
    }

    goodCount(cart: Product[]): number | void {
        let count = 0;
        for (let i = 0; i < cart.length; i++) {
            count += Number.parseInt(cart[i].qty);
            if (i === cart.length-1) {
                return count;
            }
        }
    }
}