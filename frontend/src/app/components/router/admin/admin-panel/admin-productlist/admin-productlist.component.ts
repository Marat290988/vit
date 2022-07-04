import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/services/product/product.service';
import { ListComponent } from './../../../../../inheriteds/ListComponent';
import { SearchFilter } from './productlist-panel/productlist-panel.component';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent extends ListComponent {

  searchFilter: SearchFilter = {
    product: '',
    catListSelected: [],
    manListSelected: [],
    minPrice: '',
    maxPrice: ''
  }

  constructor(
    
  ) { 
    super();
  }

  ngOnInit(): void {
    this.dataStream$ = this.productService.getAllProducts(
      this.listSize,
      this.pageNumber,
      this.sort,
      this.setFilter()
    );
    this.refClass = Product;
    //Function for prepare table data
    this.classToRow = (productList: Product[]) => {
      productList.forEach((product, index) => {
        this.tableData[index] = {...product};
        if (product.active) {
          this.tableData[index].isActive = 'is Active';
        };
      })
    }
    this.getData();
  }

  onSearchEmit(searchData: SearchFilter) {
    console.log(this.setFilter(searchData))
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
}
