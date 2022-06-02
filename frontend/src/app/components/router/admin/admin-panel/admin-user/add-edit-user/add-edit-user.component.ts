import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit, AfterViewInit {

  @ViewChild('sideSlide') sideSlide: ElementRef;
  @Output() closeEmit = new EventEmitter();
  formGroup: FormGroup;

  constructor() { }

  ngAfterViewInit(): void {
    this.setTranslate();
  }
  
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      role: new FormControl('', [
        Validators.required
      ]),
      isActive: new FormControl('', [
        Validators.required
      ]),
      isNotLocked: new FormControl('', [
        Validators.required
      ])
    });
  }

  toggleSlide() {
    this.sideSlide.nativeElement.style.transform = `translate3d(0px, 0px, 0px)`;
  }

  close() {
    this.setTranslate();
    this.closeEmit.emit();
  }

  setTranslate() {
    const slideWidth = Math.ceil(parseInt(window.getComputedStyle(this.sideSlide.nativeElement).width));
    this.sideSlide.nativeElement.style.transform = `translate3d(-${slideWidth+1}px, 0px, 0px)`;
  }

  onAddNewUser() {

  }
}
