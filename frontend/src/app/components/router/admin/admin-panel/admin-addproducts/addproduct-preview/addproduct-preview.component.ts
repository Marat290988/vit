import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-addproduct-preview',
  templateUrl: './addproduct-preview.component.html',
  styleUrls: ['./addproduct-preview.component.css']
})
export class AddproductPreviewComponent implements OnInit {

  @Input() name;
  @Input() category;
  @Input() manufacturer;
  @Input() description;
  @Input() composition;
  @Input() price;
  @Input() listUrl: any[];
  @Input() currentIndex;
  @ViewChild('imgList') imgList: ElementRef;
  transform = 0;

  constructor() { }

  ngOnInit(): void {
  }

  nl2br(str: string): string {
    return str.replace(/([^>])\n/g, '$1<br/>');
  }

  onClickArrow(direction: string) {
    let delta = direction === 'LEFT' ? -70 : 70;
    this.transform = this.transform + delta;
    if (Math.abs(this.transform/70) > this.listUrl.length-3 || this.transform > this.listUrl.length-3) {
      this.transform = this.transform - delta;
      return;
    }
    this.imgList.nativeElement.style.transform = `translateX(${this.transform}px)`;
  }

}
