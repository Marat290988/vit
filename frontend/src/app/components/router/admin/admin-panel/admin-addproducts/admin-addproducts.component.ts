import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, fromEvent, map, Observable, Subscription, switchMap } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-admin-addproducts',
  templateUrl: './admin-addproducts.component.html',
  styleUrls: ['./admin-addproducts.component.css', '../../../../../../assets/styles/form.css']
})
export class AdminAddproductsComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  catList: string[] = [];
  catListBase: string[] = [];
  manList: string[] = [];
  manListBase: string[] = [];
  subs: Subscription;
  subsComposition: Subscription;
  compositionEditList: {supl: string, qty: string}[] = [];
  nameCompStream$: Observable<any>;
  qtyCompStream$: Observable<any>;
  combinedStream$: Observable<any>;
  addCompState = false;
  
  @ViewChild('nameComposition') nameComposition: ElementRef;
  @ViewChild('qtyComposition') qtyComposition: ElementRef;

  

  constructor(
    private productService: ProductService
  ) {
      
   }

  ngOnInit(): void {
    this.setProductData();
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      composition: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      dPrice: new FormControl('', [Validators.required]),
      files: new FormControl('', [Validators.nullValidator]),
      isActive: new FormControl(true, [Validators.nullValidator]),
    });
    
  }

  ngAfterViewInit() {
    this.nameCompStream$ = fromEvent(this.nameComposition.nativeElement, 'input').pipe(
      map((event: any) => event.target.value)
    );
    this.qtyCompStream$ = fromEvent(this.qtyComposition.nativeElement, 'input').pipe(
      map((event: any) => event.target.value)
    );
    this.combinedStream$ = combineLatest([this.nameCompStream$, this.qtyCompStream$]);
    this.subsComposition = this.combinedStream$.subscribe((data: []) => {
      data.every((el): any => {
        if (el !== '') {
          this.addCompState = true;
        } else {
          this.addCompState = false;
          return false;
        }
      })
    });
  }

  ngOnDestroy() {
    this.subsComposition.unsubscribe();
  }

  onAddNewProduct() {
    
  }

  onInputForPrompt(event, list: string, listBase: string) {
    if (event.target.value.length >= 2) {
      this[list] = this[listBase].filter(el => el.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
    } else {
      this[list] = [];
    }
  }

  onPickPrompt(value: string, controlName: string) {
    this.formGroup.get(controlName).setValue(value);
    this.catList = [];
    this.manList = [];
  }

  setProductData() {
    this.subs = this.productService.getProductData().subscribe(
      {
        next: res => {
          this.catListBase = res.category;
          this.manListBase = res.manufacturer;
          this.subs.unsubscribe();
        }
      }  
    )
  }

  onBlur(list: string[]) {
    setTimeout(()=>{
      list = [];
    }, 1)
  }

}
