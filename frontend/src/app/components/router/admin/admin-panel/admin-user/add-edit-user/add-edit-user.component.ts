import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css', '../../../../../../../assets/styles/form.css']
})
export class AddEditUserComponent implements OnInit, AfterViewInit {

  @ViewChild('sideSlide') sideSlide: ElementRef;
  @Output() closeEmit = new EventEmitter();
  formGroup: FormGroup;
  valueBox = [
    {role: 'ROLE_USER'},
    {role: 'ROLE_ADMIN'}
  ]

  constructor() { }

  ngAfterViewInit(): void {
    this.setTranslate();
    this.formGroup.valueChanges.subscribe(data => console.log(data))
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

  onInput(event: InputEvent | any) {
    if (event.data === ' ') {
      event.target.value = event.target.value.slice(0 ,event.target.value.length-1);
    }
    console.log(this.formGroup.value)
  }

  addActive(event) {
    document.querySelectorAll('.radio.active').forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
    event.target.classList.add('active');
  }
}
