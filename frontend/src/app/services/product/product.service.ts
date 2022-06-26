import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

export class Product {
    name: string;
    description: string;
    composition?: string;
    manufacturer: string;
    category: string;
    dPrice: string;
    files?: any;
    isActive: any;
    productId?: string;
    id?: string;
}

@Injectable()
export class ProductService {

    host = environment.apiUrl;
    catListBase: string[] = [];
    manListBase: string[] = [];
    subs: Subscription;

    constructor(
        private http: HttpClient
    ){
        this.subs = this.getProductData().subscribe(res => {
            this.catListBase = res.category;
            this.manListBase = res.manufacturer;
            this.subs.unsubscribe();
        })
    }

    getAllProducts(
        size: number, 
        number: number, 
        sort: string, 
        name: string,
        manufacturer: string, 
        category: string
    ): Observable<any> {
        return this.http.get
            (`${this.host}/product/list?size=
                ${size}&page=${number}&sort=${sort}&name=${name}&manufacturer=${manufacturer}&category=${category}`);
    }

    getProductData(): Observable<any>{
        return this.http.get(`${this.host}/product/product_data`);
    }

    addProduct(product: Product, activeImg) {
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('composition', product.composition);
        formData.append('manufacturer', product.manufacturer);
        formData.append('category', product.category);
        formData.append('dPrice', product.dPrice);
        formData.append('isActive', product.isActive);
        formData.append('activeImg', activeImg);
        if (product.files.length > 0) {
            for (let j = 0; j < product.files.length; j++) {
                formData.append('files', product.files[j], product.files[j].name)
            }
        } else {
            formData.append('files', product.files)
        }
        return this.http.post(`${this.host}/product/addproduct`, formData);
    }
}