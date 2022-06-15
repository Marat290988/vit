import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent implements OnInit {

  productListSize = 10;
  pageNumber = 0;
  sort = 'id';

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getProduct()
  }

  getProduct() {
    this.productService.getAllProducts(this.productListSize, this.pageNumber, this.sort).subscribe({
      next: res => {
        console.log(res)
      }
    })
  }

}
