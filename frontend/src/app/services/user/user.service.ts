import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as auth from '../../store/auth.selectors'
import { User } from './../../models/user';
import { AuthData } from 'src/app/store/auth.reducer';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {

  authData$: Observable<any> = this.store$.pipe(select(auth.getAuthData));
  user: User;
  host = environment.apiUrl;

  constructor(
    private store$: Store,
    private http: HttpClient
  ) { 
    this.authData$.subscribe(data => {
      if (data) {
        this.setUser(data);
      } else {
        this.user = null;
      }
    });
  }

  private setUser(authData: AuthData): void {
    this.user = new User();
    this.user.userId = authData.userId;
    this.user.username = authData.username;
    this.user.email = authData.email;
    this.user.role = authData.role;
    this.user.lastLoginDate = null;
    this.user.lastLoginDateDisplay = null;
    this.user.joinDate = null;
    this.user.isActive = null;
    this.user.isNotLocked = null;
  }

  getAllUser(size: number, number: number, sort: string): Observable<any> {
    return this.http.get(`${this.host}/user/list?size=${size}&page=${number}&sort=${sort}`);
  }

  findUsersByUsernameOrEmail(search: string, size: number, number: number, sort: string): Observable<any> {
    return this.http.get(`${this.host}/user/searchlist?size=${size}&page=${number}&sort=${sort}&search=${search}`);
  }

}
