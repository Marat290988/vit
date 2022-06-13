import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, forkJoin, fromEvent, map, Observable, Subscription, switchMap, tap } from 'rxjs';
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
  subsDrag: Subscription;
  compositionEditList: {supl: string, qty: string}[] = [];
  tempCompData: {supl: string, qty: string};
  nameCompStream$: Observable<any>;
  qtyCompStream$: Observable<any>;
  combinedStream$: Observable<any>;
  addCompState = false;
  priceState = false;
  files: File[] = [];
  dataTransfer = new DataTransfer();
  listUrl = [];
  currentIndex = 0;
  loadingState = false
  
  @ViewChild('nameComposition') nameComposition: ElementRef;
  @ViewChild('qtyComposition') qtyComposition: ElementRef;
  @ViewChild('compPreview') compPreview: ElementRef;
  @ViewChild('wholeNumber') wholeNumber: ElementRef;
  @ViewChild('cents') cents: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  

  constructor(
    private productService: ProductService,
    private sanitazer: DomSanitizer
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
    // this.subsPrice = combineLatest([
    //   fromEvent(this.wholeNumber.nativeElement, 'input').pipe(
    //     map((event: any) => event.target.value)
    //   ),
    //   fromEvent(this.cents.nativeElement, 'input').pipe(
    //     map((event: any) => event.target.value)
    //   )
    // ]).subscribe((data: string[]) => {
    //   console.log(data)
    //   this.formGroup.get('dPrice').setValue(`${data[0]}.${data[1] === '' ? '00' : data[1]}`);
    //   data.every((el): any => {
    //     if (el !== '') {
    //       this.priceState = false;
    //     } else {
    //       this.priceState = true;
    //       return false;
    //     }
    //   })
    // });
    
  }

  ngOnDestroy() {
    this.subsComposition.unsubscribe();
    //this.subsPrice.unsubscribe();
    this.subsDrag.unsubscribe();
  }

  onAddNewProduct() {
    this.formGroup.get('files').setValue(this.dataTransfer.files);
    //this.loadingState = true;
    this.subs = this.productService.addProduct(this.formGroup.value, this.currentIndex).subscribe({
      next: res => {
        console.log(res)
        this.subs.unsubscribe();
        this.loadingState = false;
      }
    })
  }

  onInputForPrompt(event, list: string, listBase: string) {
    if (event.target.value.length >= 2) {
      this[list] = this[listBase].filter(el => el.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
    } else {
      this[list] = [];
    }
  }

  onInputPrice() {
    const wholePrice = this.wholeNumber.nativeElement.value;
    const cents = this.cents.nativeElement.value;
    if (wholePrice === '') {
      this.priceState = true;
    } else {
      this.priceState = false;
      this.formGroup.get('dPrice').setValue(`${wholePrice}.${cents === '' ? '00' : cents}`);
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
    this.handlingFileList(true, event);
  }

  addFiles(event) {
    this.handlingFileList(false, event);
  }

  handlingFileList(dropState: boolean, event) {
    let fileList = dropState ? event.dataTransfer : event.target;
    if (fileList) {
      if (this.dataTransfer.files.length === 0) {
        for (let j = 0; j < fileList.files.length; j++) {
          this.checkFileOnImg(fileList.files[j], true, this);
        }
      } else {
        for (let j = 0; j < fileList.files.length; j++) {
          let flag = true;
          const file: File = fileList.files[j];
          for (let i = 0; i < this.dataTransfer.files.length; i++) {
            if (
                  file.name === this.dataTransfer.items[i].getAsFile().name || 
                  file.lastModified === this.dataTransfer.items[i].getAsFile().lastModified || 
                  file.size === this.dataTransfer.items[i].getAsFile().size 
            ) {
              flag = false;
            }
            if (i == this.dataTransfer.files.length-1 && flag) {
              this.checkFileOnImg(fileList.files[j], false, this);
            }
          }
        }
      }
    }
    
    event.target.value = '';
  }

  checkFileOnImg(file: File, firstAdd: boolean, a: AdminAddproductsComponent) {
    let fileReader = new FileReader();
    fileReader.onloadend = function(e: any) {
      let arr = (new Uint8Array(e.target.result).subarray(0, 4));
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
          case '89504e47':
              //type = 'image/png';
              a.addUrlList(file, firstAdd, a);
              break;
          case '47494638':
              //type = 'image/gif';
              a.addUrlList(file, firstAdd, a);
              break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
              //type = 'image/jpeg';
              a.addUrlList(file, firstAdd, a);
              break;
          default:
              //type = '';
              break;
      }
    }
    fileReader.readAsArrayBuffer(file);
  }

  addUrlList(file: File, firstAdd: boolean, a: AdminAddproductsComponent) {
    a.dataTransfer.items.add(file);
    const url = a.sanitazer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    a.listUrl.push({url, active: ''});
    if (firstAdd) {
      a.listUrl[0].active = 'active';
    }
  }

  changeMainImg(index: number) {
    this.listUrl[this.currentIndex].active = '';
    this.currentIndex = index;
    this.listUrl[this.currentIndex].active = 'active';
  }

  removeImage(index: number) {
    this.dataTransfer.items.remove(index);
    this.listUrl.splice(index, 1);
    if (this.listUrl.length > 0) {
      this.listUrl[0].active = 'active';
      this.currentIndex = 0;
    }
  }

}
