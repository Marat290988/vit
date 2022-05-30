import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit, AfterViewInit {

  @ViewChild('sideSlide') sideSlide: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    const slideWidth = window.getComputedStyle(this.sideSlide.nativeElement, 'width');
    console.log(slideWidth)
    this.sideSlide.nativeElement.style.transform;
  }
  
  ngOnInit(): void {
  }

}
