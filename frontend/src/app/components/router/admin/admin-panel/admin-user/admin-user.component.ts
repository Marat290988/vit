import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { UserService } from './../../../../../services/user/user.service';
import { User } from './../../../../../models/user';
import { map } from 'rxjs';
import { tap } from 'rxjs';
import { addEditData, AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';
import { SureComponent } from 'src/app/components/pop-up/sure/sure.component';
import { PopupMessageService } from 'src/app/services/pop-up/popup-message.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit, OnDestroy {

  userListSize = 10;
  pageNumber = 0;
  sort = 'id';
  subscriber: Subscription;
  userData: User[] = [];
  rowNumber = 0;
  totalPage = 1;
  beginPage = 1;
  currentPage = 1;
  loadState = false;
  pagePaginator: any[] = [
    {number: 1, state: true, class: 'page-num active'},
    {number: '...', state: false, class: 'three-dots'},
    {number: 2, state: false, class: 'page-num'},
    {number: 3, state: false, class: 'page-num'},
    {number: 4, state: false, class: 'page-num'},
    {number: '...', state: false, class: 'three-dots'},
    {number: this.totalPage-1, state: false, class: 'page-num'},
    {number: this.totalPage, state: false, class: 'page-num'}
  ]
  changePagePag = false;
  inputSubs: Subscription;
  selectSubs: Subscription;
  popUp: Subscription;
  searchState = false;
  userStream$;
  inputSearch = '';
  editUserData: addEditData = null;
  @ViewChild('addCont') addCont: ElementRef;
  @ViewChild('tableScroll') tableScroll: ElementRef;
  @ViewChild(AddEditUserComponent) addEditComp;

  constructor(
    private userService: UserService,
    private popupService: PopupService,
    private popupMessageService: PopupMessageService
  ) { 
    this.prepareUserData();
  }
  ngOnDestroy(): void {
    this.inputSubs.unsubscribe();
    this.selectSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.getUser(this.pageNumber);
    this.inputSubs = fromEvent(document.getElementById('user-search'), 'input')
    .pipe(
      map((event: any) => event.target.value),
      debounceTime(1500)
    )
    .subscribe(input => {
      if (input === '') {
        this.beginPage = 1;
        this.currentPage = 1;
        this.searchState = false;
        this.changePagePag = false;
        this.inputSearch = input;
        this.getUser(0);
        return;
      }
      this.changePagePag = false;
      this.searchState = true;
      this.beginPage = 1;
      this.currentPage = 1;
      this.inputSearch = input;
      this.getUser(0);
    });
    this.selectSubs = fromEvent(document.getElementById('select-qty'), 'change')
      .pipe(
        map((event: any) => event.target.value),
      )
      .subscribe(select => {
        this.userListSize = select;
        this.changePagePag = false;
        this.getUser(0);
      })
  }

  getUser(pageNumber) {
    this.loadState = true;
    if (this.searchState) {
      this.userStream$ = this.userService.findUsersByUsernameOrEmail(this.inputSearch, this.userListSize, pageNumber, this.sort)
        .pipe(tap(_ => this.searchState = true))
    } else {
      this.userStream$ = this.userService.getAllUser(this.userListSize, pageNumber, this.sort);
    }
    this.subscriber = this.userStream$.subscribe({
      next: (data) => {
        this.removeActiveButtons();
        this.loadState = false;
        this.prepareUserData();
        data.content.forEach((user, index) => {
          this.userData[index] = {...user};
          this.userData[index].userId = user.userId;
          this.userData[index].username = user.username;
          this.userData[index].email = user.email;
          this.userData[index].role = user.role;
          this.userData[index].lastLoginDate = user.lastLoginDate;
          this.userData[index].lastLoginDateDisplay = user.lastLoginDateDisplay;
          this.userData[index].joinDate = user.joinDate;
          this.userData[index].password = '';
          if (user.active) {
            this.userData[index].activeString = 'Active';
          } else if (user.active === null) {
            this.userData[index].activeString = '';
          } else {
            this.userData[index].activeString = 'not Active';
          }
          if (user.notLocked) {
            this.userData[index].notLockedString = 'not Locked';
          } else if (user.notLocked === null) {
            this.userData[index].notLockedString = '';
          } else {
            this.userData[index].notLockedString = 'Locked';
          }
          this.userData[index].isActive = user.active;
          this.userData[index].isNotLocked = user.notLocked;
        });
        this.rowNumber = data.size * data.number;
        this.totalPage = data.totalPages;
        if (this.totalPage > 1) {
          this.pagePaginator[this.pagePaginator.length-1].number = this.totalPage;
          this.pagePaginator[this.pagePaginator.length-1].state = true;
        } else {
          this.pagePaginator[this.pagePaginator.length-1].number = this.totalPage;
          this.pagePaginator[this.pagePaginator.length-1].state = false;
        }
        if (!this.changePagePag) {
          this.changePagePag = true;
          this.setPaginatorData(0);
        };
        this.subscriber.unsubscribe();
      },
      error: error => {
        this.loadState = false;
      },
      complete: () => {
        this.loadState = false;
      }
    })
  }

  onClickPage(event, index: number) {
    if (this.currentPage == event.target.innerText || this.loadState) {
      return;
    };
    this.setPageNum(event.target.innerText, index);
    if (this.currentPage === event.target.innerText-1) {
      return;
    }
    this.getUser(event.target.innerText-1);
  }

  setPageNum(pageNumber: string, index: number) {
    this.currentPage = Number.parseInt(pageNumber);
    if (index === 2 && this.beginPage > 1) {
      this.beginPage = this.beginPage - 1;
      this.setPaginatorData(index+1);
    } else if (index === this.pagePaginator.length-4 && this.totalPage > this.beginPage+5) {
      this.beginPage = this.beginPage + 1;
      this.setPaginatorData(index-1);
    } else if (index === this.pagePaginator.length-1 && this.totalPage > 5) {
      this.beginPage = this.totalPage - 5;
      this.setPaginatorData(index);
    } else if (index === 0) {
      this.beginPage = 1;
      this.setPaginatorData(index);
    } else {
      this.setPaginatorData(index);
    }
  }

  onClickArrow(direction: string) {
    if (direction === 'LEFT' && this.currentPage > 1) {
      document.querySelectorAll('.page-num').forEach((el: HTMLElement) => {
        if (this.currentPage-1 === Number.parseInt(el.innerText.match(/\d+/)[0])) {
          el.click();
        }
      });
    } else if (direction === 'RIGHT' && this.currentPage < this.totalPage) {
      document.querySelectorAll('.page-num').forEach((el: HTMLElement) => {
        const plusPage = this.currentPage + 1;
        if (plusPage == Number.parseInt(el.innerText.match(/\d+/)[0])) {
          el.click();
        }
      });
    }
  }

  prepareUserData() {
    this.userData = [];
    const user = new User();
    user.isActive = null;
    user.isNotLocked = null;
    for (let i = 0; i < this.userListSize; i++) {
      this.userData.push(user);
    }
  }

  setPaginatorData(index: number) {
    this.pagePaginator[0] = {
      ...this.pagePaginator[0],
      class: 'page-num'
    };
    this.pagePaginator[7] = {
      ...this.pagePaginator[7],
      class: 'page-num'
    };
    this.pagePaginator[1] = {
      ...this.pagePaginator[1],
      state: 1 < this.beginPage
    };
    this.pagePaginator[2] = {
      ...this.pagePaginator[2],
      number: this.beginPage+1, 
      class: 'page-num',
      state: this.totalPage > this.beginPage+1
    };
    this.pagePaginator[3] = {
      ...this.pagePaginator[3],
      number: this.beginPage+2, 
      class: 'page-num',
      state: this.totalPage > this.beginPage+2
    };
    this.pagePaginator[4] = {
      ...this.pagePaginator[4],
      number: this.beginPage+3, 
      class: 'page-num',
      state: this.totalPage > this.beginPage+3
    };
    this.pagePaginator[5] = {
      ...this.pagePaginator[5],
      state: this.beginPage+5 < this.totalPage
    };
    this.pagePaginator[6] = {
      ...this.pagePaginator[6],
      state: this.totalPage-this.beginPage < 6 && this.totalPage > 5,
      class: 'page-num',
      number: this.totalPage-1
    };
    this.pagePaginator[index].class = 'page-num active';
  }

  onSelectRow(tr: HTMLElement, editUserData) {
    if (document.querySelector('tbody tr.active')) {
      document.querySelector('tbody tr.active').classList.remove('active');
    }
    if (editUserData.username === '') {
      this.removeActiveButtons();
      return;
    }
    this.editUserData = editUserData;
    tr.classList.add('active');
    if (document.querySelectorAll('.icon-container, .iconremove-container').length > 0) {
      document.querySelectorAll('.icon-container, .iconremove-container').forEach((el: HTMLElement) => {
        el.classList.add('active');
      })
    }
    this.seteditUserData(this.editUserData);
  }

  seteditUserData(data) {
    this.editUserData = {username: '', email: '', password: '', isActive: false, isNotLocked: false, role: '', id: ''};
    this.editUserData.username = data.username;
    this.editUserData.email = data.email;
    this.editUserData.password = data.password;
    this.editUserData.isActive = data.isActive;
    this.editUserData.isNotLocked = data.isNotLocked;
    this.editUserData.role = data.role;
    this.editUserData.id = data.id;
  }

  removeActiveButtons() {
    if (document.querySelectorAll('.icon-container.active, .iconremove-container.active').length > 0) {
      document.querySelectorAll('.icon-container, .iconremove-container').forEach((el: HTMLElement) => {
        el.classList.remove('active');
      })
    }
  }

  onAdd() {
    this.addCont.nativeElement.style.height = '100%';
    this.addEditComp.toggleSlide(false, null);
  }

  onEdit() {
    this.addCont.nativeElement.style.height = '100%';
    this.addEditComp.toggleSlide(true, this.editUserData);
  }

  closeAddEdit() {
    setTimeout(()=> {
      this.addCont.nativeElement.style.height = '';
      this.tableScroll.nativeElement.style.overflow = 'auto';
    }, 500);
  }

  onDeleteUser() {
    this.popUp = this.popupService.showComponent(SureComponent)
      .subscribe(
        data => {
          if (data) {
            if (data.component === null && data.state) {
              this.loadState = true;
              this.subscriber = this.userService.deleteUser(this.editUserData.username)
                .subscribe({
                  next: response => {
                    this.removeActiveButtons();
                    this.loadState = false;
                    this.subscriber.unsubscribe();
                    this.getUser(this.currentPage-1);
                  },
                  error: error => {
                    this.loadState = false;
                    if (error.error.message !== undefined) {
                      this.popupMessageService.showMessage(error.error.message);
                    }
                    this.subscriber.unsubscribe();
                  },
                  complete: () => {
                    
                  }
                })
              this.popUp.unsubscribe();
            } else if (data.component === null && !data.state) {
              this.popUp.unsubscribe();
            }
          }
        }
      )
  }

}
