import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface Product {
    name: string,
    description: string,
    composition?: string,
    manufacturer: string,
    category: string,
    dPrice: string,
    files?: FileList,
    isActive: boolean,
    productId?: string,
    id?: string
}

@Injectable()
export class ProductService {

    host = environment.apiUrl;

    constructor(
        private http: HttpClient
    ){}

    getProductData(): Observable<any>{
        return this.http.get(`${this.host}/product/product_data`);
    }

    addProduct(product: Product) {
        console.log(product)
    }
}