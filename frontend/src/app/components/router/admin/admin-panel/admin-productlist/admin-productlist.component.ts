import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Product } from 'src/app/services/product/product.service';
import { ListComponent } from './../../../../../inheriteds/ListComponent';
import { SearchFilter } from './productlist-panel/productlist-panel.component';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent extends ListComponent implements AfterViewInit {

  changeFilter$: BehaviorSubject<any> = new BehaviorSubject(null);
  filterSubs: Subscription;
  @ViewChild('editProduct') editProduct: ElementRef;
  @ViewChild('productPanel') productPanel: ElementRef;
  linkTimeout;

  constructor(
    
  ) { 
    super();
  }

  ngOnInit(): void {
    this.service = 'productService';
    this.serviceMethod = 'getAllProducts';
    this.serviceMethodDel = 'deleteProduct';
    this.refClass = Product;
    //Function for prepare table data
    this.classToRow = (productList: Product[]) => {
      productList.forEach((product, index) => {
        this.tableData[index] = {...product};
        if (product.active) {
          this.tableData[index].isActive = 'is Active';
        } else {
          this.tableData[index].isActive = 'is not Active';
        };
      })
    }
    this.getData(this.setFilter());
    this.filterSubs = this.changeFilter$
      .pipe(
        debounceTime(2000)
      )
      .subscribe((data: SearchFilter) => {
        if (data) {
          this.getData(data);
        }
      });
    this.filter = this.setFilter();
  }

  ngAfterViewInit(): void {
    if (this.editProduct) {
      this.editProduct.nativeElement.style.transform = 
        `translate3d(-${this.editProduct.nativeElement.getBoundingClientRect().width}px, 0px, 0px)`;
    }
  }

  ngOnDestroy() {
    this.filterSubs.unsubscribe();
  }

  onSearchEmit(searchData: SearchFilter) {
    this.changeFilter$.next(this.setFilter(searchData));
    this.filter = this.setFilter(searchData);
  }

  setFilter(searchData?: SearchFilter): SearchFilter {
    let tempSearch: SearchFilter = {
      product: null,
      catListSelected: null,
      manListSelected: null,
      minPrice: null,
      maxPrice: null
    }
    if (searchData) {
      if (searchData.product === '') {
        tempSearch.product = null;
      } else {
        tempSearch.product = searchData.product;
      }
      if (searchData.catListSelected.length === 0) {
        tempSearch.catListSelected = null;
      } else {
        tempSearch.catListSelected = searchData.catListSelected;
      }
      if (searchData.manListSelected.length === 0) {
        tempSearch.manListSelected = null;
      } else {
        tempSearch.manListSelected = searchData.manListSelected;
      }
      if (searchData.minPrice === '') {
        tempSearch.minPrice = null;
      } else {
        tempSearch.minPrice = searchData.minPrice;
      }
      if (searchData.maxPrice === '') {
        tempSearch.maxPrice = null;
      } else {
        tempSearch.maxPrice = searchData.maxPrice;
      }
    }
    return tempSearch;
  }

  onSelectNumRowEmit(num: number) {
    this.listSize = num;
    this.getData(this.setFilter());
  }

  onDelEmit() {
    this.onDeleteData(this.editData.productId);
  }

  onEditEmit() {
    this.transferData$.next(this.editData);
    this.editProduct.nativeElement.style.transform = 
        `translate3d(0px, 0px, 0px)`;
  }

  onCloseEmit() {
    this.editProduct.nativeElement.style.transform = 
        `translate3d(-${this.editProduct.nativeElement.getBoundingClientRect().width}px, 0px, 0px)`;
  }

  onUpdate() {
    this.getData(this.setFilter());
  }

  showSearchPanel() {
    this.productPanel.nativeElement.style.zIndex = '1000000000000000000';
    if (this.productPanel.nativeElement.style.display === 'block') {
      this.productPanel.nativeElement.style.opacity = '0';
      this.linkTimeout = setTimeout(() => {
        this.productPanel.nativeElement.style.display = 'none';
      }, 500);
    } else {
      clearTimeout(this.linkTimeout);
      this.productPanel.nativeElement.style.display = 'block';
      setTimeout(() => {
        this.productPanel.nativeElement.style.opacity = '1';
      });
    }
  }

}
