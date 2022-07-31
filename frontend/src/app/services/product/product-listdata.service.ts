import { Injectable } from '@angular/core';
import { SearchFilter } from './../../components/router/admin/admin-panel/admin-productlist/productlist-panel/productlist-panel.component';

@Injectable({
  providedIn: 'root'
})
export class ProductListdataService {
  searchFilter: SearchFilter = {
    product: null,
    catListSelected: null,
    manListSelected: null,
    minPrice: null,
    maxPrice: null
  }
  listSize = null;
  pageNumber = null;
  sort = null;

  public setPagination (
    searchFilter: SearchFilter,
    listSize,
    pageNumber,
    sort
  ): void {
    this.searchFilter = {...searchFilter};
    this.listSize = listSize;
    this.pageNumber = pageNumber;
    this.sort = sort;
  }
}
