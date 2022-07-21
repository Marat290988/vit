import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Product } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-vit-card',
  templateUrl: './vit-card.component.html',
  styleUrls: ['./vit-card.component.css']
})
export class VitCardComponent implements OnInit, AfterViewInit {

  @Input() product: Product;
  @ViewChild('img') img: ElementRef;

  constructor() { }
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.product.fileEntityList.forEach(file => {
      if (file.mainFlag) {
        this.img.nativeElement.style.backgroundImage = `url('${file.path}')`
      }
    })
  }

}
