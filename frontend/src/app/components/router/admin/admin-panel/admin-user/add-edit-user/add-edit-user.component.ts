import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from './../../../../../../services/user/user.service';
import { User } from './../../../../../../models/user';
import { PopupMessageService } from './../../../../../../services/pop-up/popup-message.service';

export interface addEditData {
  id?: string,
  username: string,
  email: string,
  password: string,
  role: string,
  isActive: boolean,
  isNotLocked: boolean
}

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
    {role: 'ROLE_USER', id: 'ROLE_USER', name: 'User'},
    {role: 'ROLE_ADMIN', id: 'ROLE_ADMIN', name: 'Admin'}
  ]
  loadingState = false;
  message = '';
  addEditSubs: Subscription;
  initFormData = {
    username: null,
    email: null,
    password: null,
    role: 'ROLE_USER',
    isActive: false,
    isNotLocked: false
  }
  editState = false;
  currentUserId: string = null;
  @Output() updateEmit = new EventEmitter();
  title: string;

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

  toggleSlide(editState: boolean, editUserData?: addEditData) {
    this.sideSlide.nativeElement.style.transform = `translate3d(0px, 0px, 0px)`;
    if (editState) {  
      this.title = 'Edit user';
      this.currentUserId = editUserData.id;
      this.editState = editState;
      this.onAddEdit(editUserData);
      this.formGroup.get('password').clearValidators();
      this.formGroup.get('password').updateValueAndValidity();
    } else {
      this.title = 'Add new user';
      this.editState = false;
      this.onAddEdit(null);
      this.formGroup.get('password').setValidators([Validators.required, Validators.minLength(6)]);
      this.formGroup.get('password').updateValueAndValidity();
    }
  }

  close() {
    if (this.editState) {
      this.resetForm()
    } else {
      for (let key in this.formGroup.value) {
        this.initFormData[key] = this.formGroup.value[key];
      }
    }
    this.setTranslate();
    this.closeEmit.emit();
  }

  setTranslate() {
    const slideWidth = Math.ceil(parseInt(window.getComputedStyle(this.sideSlide.nativeElement).width));
    this.sideSlide.nativeElement.style.transform = `translate3d(-${slideWidth+1}px, 0px, 0px)`;
  }

  onAddNewUser() {
    const data: FormData = this.userService.createUserForm(this.formGroup.value);
    let funcName = 'addUser'
    if (this.editState) {
      funcName = 'editUser';
      data.set('id', this.currentUserId);
    }
    this.loadingState = true;
    this.addEditSubs = this.userService[funcName](data).subscribe({
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
        this.editState = false;
      },
      complete: () => {
        this.loadingState = false;
        this.addEditSubs.unsubscribe();
        this.resetForm();
        this.updateEmit.emit();
        this.editState = false;
        this.close();
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
    this.resetAllActiveClass();
    document.querySelector(`[for='${this.valueBox[0].id}']`).classList.add('active');
    this.formGroup.get('isActive').setValue(false);
    this.formGroup.get('isNotLocked').setValue(false);
    this.initFormData = {
      username: null,
      email: null,
      password: null,
      role: 'ROLE_USER',
      isActive: false,
      isNotLocked: false
    };
  }

  resetAllActiveClass() {
    document.querySelectorAll(`[for='${this.valueBox[0].id}'].active, [for='${this.valueBox[1].id}'].active`).forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
    document.querySelectorAll(`.checkbox.active`).forEach((el: HTMLElement)=> {
      el.classList.remove('active');
    });
  }

  onAddEdit(userData?: addEditData) {
    userData ? this.setForm(userData) : this.setForm(this.initFormData);
  }

  setForm(userData: addEditData) {
    this.resetAllActiveClass();
    for (let key in userData) {
      switch(key) {
        case 'role':
          document.querySelector(`[for='${userData[key]}']`).classList.add('active');
          this.formGroup.get(key).setValue(userData[key]);
          break;
        case 'isActive':
          if (userData[key]) {
            document.querySelector(`[for='${key}']`).classList.add('active');
          }
          this.formGroup.get(key).setValue(userData[key]);
          break;
        case 'isNotLocked':
          if (userData[key]) {
            document.querySelector(`[for='${key}']`).classList.add('active');
          }
          this.formGroup.get(key).setValue(userData[key]);
          break;
        case 'id':
          break;
        default: 
          this.formGroup.get(key).setValue(userData[key]);
          break;
      }
    }
  }

}
