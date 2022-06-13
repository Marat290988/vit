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
    files?: any,
    isActive: any,
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
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('composition', product.composition);
        formData.append('manufacturer', product.manufacturer);
        formData.append('category', product.category);
        formData.append('dPrice', product.dPrice);
        formData.append('isActive', product.isActive);
        if (product.files.length > 0) {
            console.log(product.files)
            for (let j = 0; j < product.files.length; j++) {
                formData.append('files', product.files[j], product.files[j].name)
            }
        }
        return this.http.post(`${this.host}/product/addproduct`, formData);
    }
}