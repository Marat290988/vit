import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ProductService {

    host = environment.apiUrl;

    constructor(
        private http: HttpClient
    ){}

    getProductData(): Observable<any>{
        return this.http.get(`${this.host}/product/product_data`);
    }
}