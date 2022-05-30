import { Component, ElementRef, OnDestroy, ViewChild, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Store, select } from '@ngrx/store';
import * as auth from './store/auth.selectors';
import { login } from './store/auth.actions';
import { SureComponent } from './components/pop-up/sure/sure.component';
import { PopupService } from './services/pop-up/pop-up.service';
import { Router } from '@angular/router';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  
  @ViewChild('signPopupCont') signPopupCont: ElementRef;
  
  
  subsRegistr: Subscription;
  authData$: Observable<any> = this.store$.pipe(select(auth.getAuthData));

  constructor (
    private authenticationService: AuthenticationService,
    private store$: Store,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authData$.subscribe(state => {if (state) {this.closeSignPopup()}});
    this.popupService.subjectLogin.subscribe(state => {
      if (state) {
        this.onSing();
      }
    })
  }
  
  onSing() {
    this.signPopupCont.nativeElement.style.display = 'flex';
    setTimeout(()=> {
      this.signPopupCont.nativeElement.style.background = '#25afa25e';
    });
  }

  closeSignPopup() {
    if (this.signPopupCont) {
      this.signPopupCont.nativeElement.style.display = '';
      this.signPopupCont.nativeElement.style.background = '';
    }
  }

  onSubmitSign(formValue) {
    this.store$.dispatch(login(formValue));
  }

  onLogoutEmit() {
    this.authenticationService.logout();
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    
  }

}
