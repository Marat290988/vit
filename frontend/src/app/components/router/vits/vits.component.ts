import { Component, OnInit } from '@angular/core';
import { ListComponent } from 'src/app/inheriteds/ListComponent';
import { Product } from 'src/app/services/product/product.service';
import { SearchFilter } from '../admin/admin-panel/admin-productlist/productlist-panel/productlist-panel.component';

@Component({
  selector: 'app-vits',
  templateUrl: './vits.component.html',
  styleUrls: ['./vits.component.css']
})
export class VitsComponent extends ListComponent implements OnInit {

  constructor() { 
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
    this.filter = this.setFilter();
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
