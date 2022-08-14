import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from 'rxjs';
import { Product } from './../product/product.service';
import { Big } from 'big.js';
import { environment } from "src/environments/environment";
import { UserService } from './../user/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor(
        private userService: UserService,
        private http: HttpClient
    ) {
        this.userService.authData$.subscribe(data => {
            if (data) {
                const subs = this.getCart().subscribe({
                    next: res => {
                      this.cart = JSON.parse(res.cartText);
                      this.addEvent$.next(this.goodCount(this.cart));
                      subs.unsubscribe();
                    }
                })
            }
        })
    }

    host = environment.apiUrl;
    cart: Product[] = [];
    addEvent$ = new BehaviorSubject<number | any>(null);

    addToCart(product: Product, qty: string): Observable<any> | void {
        let pIndex = null;
        this.cart.filter((i, index) => {
            if (i.productId === product.productId) {
                i.qty = String(Number.parseInt(qty));
                pIndex = index;
            };
        });
        if (pIndex === null) {
            this.cart.push({...product, qty});
        }
        this.addEvent$.next(this.goodCount(this.cart));
        this.saveCart(this.cart);
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

    saveCart(cart: Product[]): void {
        const userId = this.userService.user.userId;
        const cartSave = [];
        for (let i = 0; i < cart.length; i++) {
            cartSave.push({
                productId: cart[i].productId, 
                qty: cart[i].qty,
                name: cart[i].name,
                fileEntityList: cart[i].fileEntityList,
                basePrice: cart[i].basePrice
            });
            if (i === cart.length-1) {
                const subs = this.http.post(`${this.host}/cart/update/${userId}`,
                    {cartText: JSON.stringify(cartSave)}
                ).subscribe({
                    next: res => {
                        subs.unsubscribe();
                    }
                })
            }
        }
        if (cart.length === 0) {
            const subs = this.http.post(`${this.host}/cart/update/${userId}`,
                    {cartText: JSON.stringify(cartSave)}
                ).subscribe({
                    next: res => {
                        subs.unsubscribe();
                    }
                })
        }
    }

    getCart(): Observable<any> {
        const userId = this.userService.user.userId;
        return this.http.get(`${this.host}/cart/usercart/${userId}`);
    }

    getObs() {
        return this.getCart().pipe(
            map(res => JSON.parse(res.cartText))
        )
    }

    removeItem(productId: string) {
        let i = null;
        this.cart.map((item, index) => {
            if (item.productId === productId) {
                i = index;
            }
            if (this.cart.length-1 === index && i !== null) {
                this.cart.splice(i, 1);
                this.saveCart(this.cart);
                this.addEvent$.next(this.goodCount(this.cart));
            }
        })
    }

    calcAmount(): void | string {
        let total = '0';
        for (let i = 0; i < this.cart.length; i++) {
            const big = new Big(this.cart[i].basePrice).times(this.cart[i].qty).plus(Number.parseFloat(total));
            total = big.toFixed(2);
            if (this.cart.length-1 === i) {
                return total;
            }
        }
    }

    placeOrder(): any {
        const userId = this.userService.user.userId;
        const productCart = [];
        for (let i = 0; i < this.cart.length; i++) {
            productCart.push({
                productId: this.cart[i].productId,
                qty: this.cart[i].qty
            });
            if (this.cart.length-1 === i) {
                return this.http.post(`${this.host}/order/place_order/${userId}`, productCart);
            }
        }
    }
}