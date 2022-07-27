import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, switchMap } from 'rxjs';
import { ProductListdataService } from './../../../../services/product/product-listdata.service';
import { Product, ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-vit-card-details',
  templateUrl: './vit-card-details.component.html',
  styleUrls: ['./vit-card-details.component.css']
})
export class VitCardDetailsComponent implements OnInit, OnDestroy {

  routeSubs: Subscription;
  product: Product;
  mainImageUrl: string;
  imgUrlArr: any[] = [];

  constructor(
    private activetedRouted: ActivatedRoute,
    private listDataService: ProductListdataService,
    private productService: ProductService
  ) { 
    
  }

  ngOnInit(): void {
    this.routeSubs = this.activetedRouted.queryParamMap
      .pipe(
        map((paramsAsMap: any) => paramsAsMap.params.id),
        switchMap(id => {
          return this.productService.getProduct(id);
        })
      )
      .subscribe((product: Product) => {
        this.product = product;
        this.product.fileEntityList.forEach((file: {path: string, mainFlag: boolean}) => {
          if (file.mainFlag) {
            this.imgUrlArr.unshift({url: `url('${file.path}')`, current: true});
            this.mainImageUrl = `url('${file.path}')`;
          } else {
            this.imgUrlArr.push({url: `url('${file.path}')`, current: false});
          }
        })
        console.log(this.product)
      });
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
  }

}
