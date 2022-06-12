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
  subsPrice: Subscription;
  compositionEditList: {supl: string, qty: string}[] = [];
  tempCompData: {supl: string, qty: string};
  nameCompStream$: Observable<any>;
  qtyCompStream$: Observable<any>;
  combinedStream$: Observable<any>;
  addCompState = false;
  priceState = false;
  files: File[] = [];
  dataTransfer = new DataTransfer();  
  
  @ViewChild('nameComposition') nameComposition: ElementRef;
  @ViewChild('qtyComposition') qtyComposition: ElementRef;
  @ViewChild('compPreview') compPreview: ElementRef;
  @ViewChild('wholeNumber') wholeNumber: ElementRef;
  @ViewChild('cents') cents: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  

  constructor(
    private productService: ProductService
  ) {
      
   }

  ngOnInit(): void {
    this.setProductData();
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      composition: new FormControl('', [Validators.nullValidator]),
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
    this.subsComposition = this.combinedStream$.subscribe((data: string[]) => {
      this.tempCompData = {
        supl: data[0],
        qty: data[1]
      };
      data.every((el): any => {
        if (el !== '') {
          this.addCompState = true;
        } else {
          this.addCompState = false;
          return false;
        }
      })
    });
    this.subsPrice = combineLatest([
      fromEvent(this.wholeNumber.nativeElement, 'input').pipe(
        map((event: any) => event.target.value)
      ),
      fromEvent(this.cents.nativeElement, 'input').pipe(
        map((event: any) => event.target.value)
      )
    ]).subscribe((data: string[]) => {
      this.formGroup.get('dPrice').setValue(`${data[0]}.${data[1] === '' ? '00' : data[1]}`);
      data.every((el): any => {
        if (el !== '') {
          this.priceState = false;
        } else {
          this.priceState = true;
          return false;
        }
      })
    });
    fromEvent(document.querySelector('.file-field'), 'dragover').subscribe(event => {
      event.preventDefault();
    })
  }

  ngOnDestroy() {
    this.subsComposition.unsubscribe();
    this.subsPrice.unsubscribe();
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

  addToCompEditList() {
    if (this.addCompState) {
      this.compositionEditList.push(this.tempCompData);
      this.nameComposition.nativeElement.value = '';
      this.qtyComposition.nativeElement.value = '';
      this.addCompState = false;
    };
    this.drawComposition();
  }

  onRemoveFromCompEditList(index: number) {
    this.compositionEditList.splice(index, 1);
    this.drawComposition();
  }

  drawComposition() {
    let drawEl = '';
    this.compositionEditList.forEach((comp: {supl: string, qty: string}, i) => {
      drawEl += 
        `<div style="min-width: 15px;">${i+1}<div>
         <div style="width: calc(100% - 8pxpx);">${comp.supl}</div>  
         <div style="width: calc(20% - 7px);">${comp.qty}</div>      
      `;
    });
    this.formGroup.get('composition').setValue(drawEl);
    this.compPreview.nativeElement.innerHTML = drawEl;
  }

  blockNotNumeric(event) {
    let checkValue: string = event.target.value;
    let lastInput = event.data;
    if (lastInput !== null && lastInput.match(/[0-9]/) === null) {
      event.target.value = checkValue.slice(0, checkValue.length-1);
    }
  }

  toggleActive(event) {
    const name = event.target.getAttribute('for');
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      this.formGroup.get(name).setValue(false);
    } else {
      event.target.classList.add('active');
      this.formGroup.get(name).setValue(true);
    }
  }

  dropFiles(event) {
    event.preventDefault();
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          this.dataTransfer.items.add(event.dataTransfer.items[i].getAsFile());
        }
      }
    }
  }

  addFiles(event) {
    this.handlingFileList(false, event);
  }

  handlingFileList(dropState: boolean, event) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.dataTransfer.items.add(event.target.files[i]);
      }
    }
    event.target.files = this.dataTransfer.files;
    console.log(event.target.files)
  }

}
