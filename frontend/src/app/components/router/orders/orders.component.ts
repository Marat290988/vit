import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  sort = 'orderDate,desc';
  size = 5;
  pageNumber = 0;
  orderHistory = [];

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const subs = this.cartService.getAllOrders(this.size, this.pageNumber, this.sort)
      .subscribe({
        next: res => {
          console.log(res)
          this.orderHistory.push(...res.content);
          console.log(this.orderHistory)
          subs.unsubscribe();
        }
      })
  }

}
