import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { login } from './../../../store/auth.actions';
import * as auth from '../../../store/auth.selectors';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  formGroupSign: FormGroup;
  formGroupRegister: FormGroup;
  signState = true;
  checkPasswordState = true;
  subs: Subscription[] = [];
  loadingState = false;
  subsRegistr: Subscription;
  message: string;

  loading$: Observable<boolean> = this.store$.pipe(select(auth.getLoading));
  serverError$: Observable<string> = this.store$.pipe(select(auth.getServerError));

  @Output() closePopup = new EventEmitter();
  @Output() submitEmit = new EventEmitter();
  
  constructor(
    private store$: Store,
    private authService: AuthenticationService
  ) { }
  

  ngOnInit(): void {
    this.formGroupSign = new FormGroup({
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ])
    });
    this.formGroupRegister = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      checkPassword: new FormControl('', [
        Validators.required
      ])
    });
    this.formGroupRegister.valueChanges.subscribe(val => {
      this.checkPasswordState = val.checkPassword === val.password ? false : true;
    });
    this.subs.push(this.loading$.subscribe(state => {this.loadingState = state;}));
  }

  onSubmitSign() {
    const strForCheck = this.formGroupSign.get('username').value;
    const stateEmail = strForCheck.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/);
    if (stateEmail !== null) {
      this.submitEmit.emit({
        email: this.formGroupSign.get('username').value,
        password: this.formGroupSign.get('password').value
      });
    } else {
      this.submitEmit.emit(this.formGroupSign.value);
    }
  }

  onSubmitRegister() {
    const username: string = this.formGroupRegister.get('username').value;
    const email: string = this.formGroupRegister.get('email').value;
    const password: string = this.formGroupRegister.get('password').value;
    this.loadingState = true;
    this.subsRegistr = this.authService.register({username, email, password}).subscribe(
      {
        next: (response) => {
          console.log(response)
          this.loadingState = false;
          this.message = 'You have successfully registered';
          this.formGroupRegister.reset();
        },
        error: (error) => {
          this.loadingState = false;
          this.subsRegistr.unsubscribe();
          if (error.status > 0) {
            this.message = error.error.message;
          } else {
            this.message = 'No connection';
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(el => el.unsubscribe());
  }


}
