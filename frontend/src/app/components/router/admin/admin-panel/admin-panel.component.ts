import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  @ViewChild('movingBlock') movingBlock: ElementRef;

  constructor(
    
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.setActiveLink();
  }

  onClickLink(n: number): void {
    this.movingBlock.nativeElement.style.left = `${n * 90}px`;
  }

  setActiveLink() {
    let link = 0;
    if (window.location.href.indexOf('admin-productlist') > -1) {
      link = 1;
    } else if (window.location.href.indexOf('admin-addproduct') > -1) {
      link = 2;
    }
    this.onClickLink(link);
  }

}
