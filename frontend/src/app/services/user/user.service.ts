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

  addUser(user) {
    return this.http.post(`${this.host}/user/adduser`, user);
  }

  editUser(user) {
    return this.http.post(`${this.host}/user/edituser`, user);
  }

  deleteUser(username: string) {
    return this.http.delete(`${this.host}/user/delete/${username}`);
  }

  createUserForm(user) {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('isActive', user.isActive);
    formData.append('isNotLocked', user.isNotLocked);
    formData.append('id', '');
    return formData;
  }

}
