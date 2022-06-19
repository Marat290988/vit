import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/services/product/product.service';
import { ListComponent } from './../../../../../inheriteds/ListComponent';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent extends ListComponent {

  manufacturer = '';
  category = '';
  name = '';

  constructor(
    
  ) { 
    super();
  }

  ngOnInit(): void {
    this.dataStream$ = this.productService.getAllProducts(
      this.listSize,
      this.pageNumber,
      this.sort,
      this.name,
      this.manufacturer,
      this.category
    );
    this.refClass = Product;
    this.classToRow = (productList: Product[]) => {
      productList.forEach((product, index) => {
        this.tableData[index] = {...product};
        if (product.isActive) {
          this.tableData[index].isActive = 'is Active';
        };
      })
    }
  }

  // getProduct() {
  //   this.productService.getAllProducts(
  //     this.listSize, 
  //     this.pageNumber, 
  //     this.sort,
  //     this.manufacturer,
  //     this.category
  //   ).subscribe({
  //     next: res => {
  //       console.log(res)
  //     }
  //   })
  // }

}
