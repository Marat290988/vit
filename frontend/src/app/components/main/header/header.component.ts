import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from './../../../services/user/user.service';
import { PopupService } from './../../../services/pop-up/pop-up.service';
import { SureComponent } from './../../../components/pop-up/sure/sure.component';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() signEvent = new EventEmitter();
  @Output() logoutEvent = new EventEmitter();
  subs: Subscription;
  cartSubs: Subscription;
  displayCount = 0;

  constructor(
    public userService: UserService,
    private popupService: PopupService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartSubs = this.cartService.addEvent$.subscribe(qty => {
      if (qty !== null) {
        this.displayCount = qty;
      }
    })
  }

  ngOnDestroy() {
    this.cartSubs.unsubscribe();
  }

  onLogout(): void {
    this.logoutEvent.emit();
  }

  showLogoutWindow() {
    this.popupService.showComponent(SureComponent);
    this.subs = this.popupService.subject.subscribe((data: {component: any, state: boolean}) => {
      if (data) {
        if (data.component === null && data.state) {
          this.onLogout();
          this.subs.unsubscribe();
        } else if (data.component === null && !data.state) {
          this.subs.unsubscribe();
        }
      }
    });
  }

  isAdmin(): boolean {
    if (this.userService.user) {
      return this.userService.user.role === 'ROLE_ADMIN';
    } else {
      return false;
    }
  }

}
