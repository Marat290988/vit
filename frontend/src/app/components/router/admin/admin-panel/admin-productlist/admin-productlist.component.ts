import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent implements OnInit {

  constructor(
    productService: ProductService
  ) { }

  ngOnInit(): void {
  }

}
