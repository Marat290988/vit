import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  @Input() currentIndexObserve$: Observable<{id: number, listUrl: any[]}>;
  @Input() compositionObserve$: Observable<any>;
  @ViewChild('imgList') imgList: ElementRef;
  @ViewChild('imgMain') imgMain: ElementRef;
  @ViewChild('compositionDiv') compositionDiv: ElementRef;
  transform = 0;
  indexSub: Subscription;
  compSub: Subscription;
  listUrl: any[] = [];

  constructor(
    private sanitazer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.indexSub = this.currentIndexObserve$.subscribe((data: {id: number, listUrl: any[]}) => {
      if (data !== null) {
        let ind;
        this.listUrl = [...data.listUrl];
        if (data.id !== null) {
          let cutEl = this.listUrl.filter((el, index):any => {
            if (el.id === data.id) {
              ind = index;
              return el;
            }
          });
          this.listUrl.splice(ind, 1);
          this.listUrl.unshift(...cutEl);
          if (this.listUrl.length <= 3 && this.imgList) {
            this.imgList.nativeElement.style.transform = `translateX(${0}px)`;
          }
        }
      }
    });
    this.compSub = this.compositionObserve$.subscribe(innerHTML => {
      if (innerHTML !== null) {
        this.compositionDiv.nativeElement.innerHTML = innerHTML;
      }
    })
  }

  ngOnDestroy() {
    this.indexSub.unsubscribe();
    this.compSub.unsubscribe();
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

  sanitezeHTML() {
    return this.sanitazer.bypassSecurityTrustHtml(this.composition);
  }


}
