import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from './../../../../../../services/user/user.service';
import { User } from './../../../../../../models/user';
import { PopupMessageService } from './../../../../../../services/pop-up/popup-message.service';

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
    {role: 'ROLE_USER', id: 'user', name: 'User'},
    {role: 'ROLE_ADMIN', id: 'admin', name: 'Admin'}
  ]
  loadingState = false;
  message = '';
  addEditSubs: Subscription;

  constructor(
    private userService: UserService,
    private popupMessageService: PopupMessageService
  ) { }

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
      role: new FormControl('ROLE_USER', [
        Validators.required
      ]),
      isActive: new FormControl(false, [
        Validators.required
      ]),
      isNotLocked: new FormControl(false, [
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
    const data: FormData = this.userService.createUserForm(this.formGroup.value);
    this.loadingState = true;
    this.addEditSubs = this.userService.addUser(data).subscribe({
      next: response => {
        this.message = 'You have successfully added user';
        this.showMessage(this.message);
      },
      error: error => {
        if (error.status > 0) {
          this.message = error.error.message;
        } else {
          this.message = 'No connection';
        }
        this.loadingState = false;
        this.showMessage(this.message);
        this.addEditSubs.unsubscribe();
        this.resetForm();
      },
      complete: () => {
        this.loadingState = false;
        this.addEditSubs.unsubscribe();
        this.resetForm();
      }
    })
  }

  onInput(event: InputEvent | any) {
    if (event.data === ' ') {
      event.target.value = event.target.value.slice(0 ,event.target.value.length-1);
    }
  }

  addActive(event) {
    document.querySelectorAll(`[for='${this.valueBox[0].id}'].active, [for='${this.valueBox[1].id}'].active`).forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
    event.target.classList.add('active');
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

  showMessage(message) {
    this.popupMessageService.showMessage(message);
  }

  resetForm() {
    this.formGroup.reset();
    this.formGroup.get('role').setValue('ROLE_USER');
    document.querySelectorAll(`[for='${this.valueBox[0].id}'].active, [for='${this.valueBox[1].id}'].active`).forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
    document.querySelectorAll(`.checkbox.active`).forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
    document.querySelector(`[for='${this.valueBox[0].id}']`).classList.add('active');
    this.formGroup.get('isActive').setValue(false);
    this.formGroup.get('isNotLocked').setValue(false);
  }

}
