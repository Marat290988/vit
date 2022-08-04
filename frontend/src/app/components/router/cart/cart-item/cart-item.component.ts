import { Component, Input, OnInit } from '@angular/core';
import { Product } from './../../../../services/product/product.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() item: Product;
  fileUrl = null;

  constructor() { }

  ngOnInit(): void {
    const fileItem = this.item.fileEntityList.filter(i => i.mainFlag);
    if (fileItem.length > 0) {
      this.fileUrl = fileItem[0].path;
    }
  }

}
