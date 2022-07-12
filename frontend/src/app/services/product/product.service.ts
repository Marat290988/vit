import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { SearchFilter } from './../../components/router/admin/admin-panel/admin-productlist/productlist-panel/productlist-panel.component';

export class Product {
    name: string;
    description: string;
    composition?: string;
    manufacturer: string;
    category: string;
    dPrice: string;
    basePrice?: string;
    files?: any;
    fileEntityList?: any;
    isActive?: any;
    active?: any;
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
        filter: SearchFilter
    ): Observable<any> {
        return this.http.post
            (`${this.host}/product/list?size=${size}&page=${number}&sort=${sort}`, filter);
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

    editProduct(editData): Observable<Product> {
        return this.http.post<Product>(`${this.host}/product/edit_product`, editData, {
            // headers: new HttpHeaders({
            //     'Content-Type':  'undefined',
            // })
        })
    }

    deleteProduct(productId: string) {
        return this.http.delete(`${this.host}/product/delete/${productId}`);
    }

    getFileList(productId: string) {
        return this.http.get(`${this.host}/product/filelist/${productId}`);
    }
}