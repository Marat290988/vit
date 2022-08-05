import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from './../../../../services/product/product.service';
import { filter, fromEvent, map, pipe } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() item: Product;
  fileUrl = null;
  rowQty = [];
  selectContState = false;
  activeIndex: number;
  subs: Subscription;

  constructor() { }

  ngOnInit(): void {
    const fileItem = this.item.fileEntityList.filter(i => i.mainFlag);
    if (fileItem.length > 0) {
      this.fileUrl = fileItem[0].path;
    }
    for (let i = 0; i < 10; i++) {
      this.rowQty.push({
        q: i+1,
        s: String(i+1) === String(this.item.qty)
      });
      if (String(i+1) === String(this.item.qty)) {
        this.activeIndex = i;
      }
    }
  }

  selectQty() {
    this.selectContState = true;
    setTimeout(() => {
      this.subs = fromEvent(document, 'click')
      .pipe(
        map((event: MouseEvent) => event.target)
      )
      .subscribe((target: HTMLElement) => {
        if (!target.closest('.product-row-qty')) {
          this.selectContState = false;
          this.subs.unsubscribe();
        }
      });
    }, 100)
  }

  onSelectQty(qty, selectItem: HTMLElement, index: number) {
    this.item.qty = qty.q;
    document.querySelector('div[select="selected"]').setAttribute('select', 'none');
    selectItem.setAttribute('select', 'selected');
    this.rowQty[this.activeIndex].s = false;
    this.activeIndex = index;
    this.rowQty[index].s = true;
    this.subs.unsubscribe();
    setTimeout(()=> {
      this.selectContState = false;
    }, 10);
  }

}
