import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

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
  @Input() currentIndexObserve$: Observable<number>;
  @ViewChild('imgList') imgList: ElementRef;
  @ViewChild('imgMain') imgMain: ElementRef;
  transform = 0;
  indexSub: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.indexSub = this.currentIndexObserve$.subscribe(id => {
      if (id !== null) {
        let ind;
        this.listUrl = [...this.listUrl];
        let cutEl = this.listUrl.filter((el, index):any => {
          if (el.id === id) {
            ind = index;
            return el;
          }
        });
        this.listUrl.splice(ind, 1);
        this.listUrl.unshift(...cutEl);
      }
    })
  }

  ngOnDestroy() {
    this.indexSub.unsubscribe();
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

  selectImg(index, miniImg) {
    if (document.querySelector('.mini-img-cont.active')) {
      document.querySelector('.mini-img-cont.active').classList.remove('active');
    }
    miniImg.classList.add('active')
    this.imgMain.nativeElement.src = this.listUrl[index].url.changingThisBreaksApplicationSecurity;
  }


}
