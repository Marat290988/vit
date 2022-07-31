import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { ListComponent } from 'src/app/inheriteds/ListComponent';
import { Product } from 'src/app/services/product/product.service';
import { SearchFilter } from '../admin/admin-panel/admin-productlist/productlist-panel/productlist-panel.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductListdataService } from './../../../services/product/product-listdata.service';

@Component({
  selector: 'app-vits',
  templateUrl: './vits.component.html',
  styleUrls: ['./vits.component.css']
})
export class VitsComponent extends ListComponent implements OnInit {

  changeFilter$: BehaviorSubject<any> = new BehaviorSubject(null);
  filterSubs: Subscription;
  listDataSubs: Subscription;

  constructor(
    private listDataService: ProductListdataService
  ) { 
    super();
    this.listSize = 12;
  }

  ngOnInit(): void {
    this.service = 'productService';
    this.serviceMethod = 'getAllProducts';
    this.refClass = Product;
    this.classToRow = (productList: Product[]) => {
      productList.forEach((product, index) => {
        this.tableData[index] = {...product};
      })
    }
    this.getData(this.setFilter());
    this.filterSubs = this.changeFilter$
      .pipe(
        debounceTime(500)
      )
      .subscribe((data: SearchFilter) => {
        if (data) {
          this.getData(data);
        }
      });
    this.filter = this.setFilter();
    this.listDataSubs = this.eventOfFetchData.subscribe(_ => {
      if (_) {
        this.setListData();
      }
    });
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
      if (searchData.catListSelected && searchData.catListSelected.length === 0) {
        tempSearch.catListSelected = null;
      } else {
        tempSearch.catListSelected = searchData.catListSelected;
      }
      if (searchData.manListSelected && searchData.manListSelected.length === 0) {
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

  onSearchEmit(searchData: SearchFilter) {
    this.changePagePag = false;
    this.changeFilter$.next(this.setFilter(searchData));
    this.filter = this.setFilter(searchData);
  }

  setListData() {
    this.listDataService.setPagination(
      this.filter,
      this.listSize,
      this.pageNumber,
      this.sort
    );
  } 

}
