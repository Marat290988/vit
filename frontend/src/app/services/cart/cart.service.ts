import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Product } from './../product/product.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    addingCartStream$ = new BehaviorSubject<{product: Product, qty: number}>(null);
}