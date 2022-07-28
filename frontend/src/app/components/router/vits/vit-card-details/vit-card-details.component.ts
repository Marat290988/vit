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
  transform = 0;
  @ViewChild('carausel') carausel: ElementRef;

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

  onClickMiniImg(event, url: string) {
    document.querySelector('.mini-img.active').classList.remove('active');
    event.target.classList.add('active');
    this.mainImageUrl = url;
  }

  onClickArrow(operation) {
    const minTransform = -75*(this.imgUrlArr.length-4);
    if (
      this.transform === minTransform && operation === '+' ||
      this.transform === 0 && operation === '-'
    ) {
      return;
    };
    if (operation === '+') {
      this.transform -= 75;
    } else {
      this.transform += 75;
    }
    this.carausel.nativeElement.style.transform = `translateX(${this.transform}px)`;
  }

}
