
import { UserService } from './../services/user/user.service';
import { InjectService } from './../services/inject/inject.service';
import { Product, ProductService } from 'src/app/services/product/product.service';
import { PopupService } from './../services/pop-up/pop-up.service';
import { PopupMessageService } from './../services/pop-up/popup-message.service';
import { Subscription, filter } from 'rxjs';
import { Observable } from 'rxjs';

// @Injectable({providedIn: 'root'})
export class ListComponent {

    userService: UserService;
    productService: ProductService;
    popupService: PopupService;
    popupMessageService: PopupMessageService;

    loadState = false;

    //Pageable variables
    listSize = 10;
    pageNumber = 0;
    sort = 'id';
    rowNumber = 0;
    totalPage = 1;
    beginPage = 1;
    currentPage = 1;
    pagePaginator: any[] = [
        {number: 1, state: true, class: 'page-num active'},
        {number: '...', state: false, class: 'three-dots'},
        {number: 2, state: false, class: 'page-num'},
        {number: 3, state: false, class: 'page-num'},
        {number: 4, state: false, class: 'page-num'},
        {number: '...', state: false, class: 'three-dots'},
        {number: this.totalPage-1, state: false, class: 'page-num'},
        {number: this.totalPage, state: false, class: 'page-num'}
    ];
    changePagePag = false;
    tableData = [];
    refClass;
    classToRow: Function;
    editData;
    cssClassPage = 'page-num';
    service: string = '';
    serviceMethod: string = '';

    subsData: Subscription;
    dataStream$: Observable<any>;

    constructor() {
        this.userService = InjectService.injector.get(UserService);
        this.productService = InjectService.injector.get(ProductService);
        this.popupService = InjectService.injector.get(PopupService);
        this.popupMessageService = InjectService.injector.get(PopupMessageService);
    }

    getData(filter) {
        this.loadState = true;
        this.dataStream$ = this[this.service][this.serviceMethod](
          this.listSize,
          this.pageNumber,
          this.sort,
          filter
        );
        this.subsData = this.dataStream$.subscribe({
            next: res => {
                this.removeActiveButtons();
                this.loadState = false;
                this.prepareData();
                this.classToRow(res.content);
                this.rowNumber = res.size * res.number;
                this.totalPage = res.totalPages;
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
                this.subsData.unsubscribe();
            },
            error: error => {
                this.loadState = false;
                this.subsData.unsubscribe();
            },
            complete: () => {
                this.loadState = false;
            }
        });
    }

    removeActiveButtons() {
        if (document.querySelectorAll('.icon-container.active, .iconremove-container.active').length > 0) {
            document.querySelectorAll('.icon-container, .iconremove-container').forEach((el: HTMLElement) => {
                el.classList.remove('active');
            })
        }
    }

    prepareData() {
        this.tableData = [];
        const row = new this.refClass; 
        for (let i = 0; i < this.listSize; i++) {
            this.tableData.push(row);
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

    onSelectRow(tr: HTMLElement, editData, state: string) {
        if (document.querySelector('tbody tr.active')) {
          document.querySelector('tbody tr.active').classList.remove('active');
        }
        if (editData.isActive === '') {
          this[state] = true;
          return;
        }
        this.editData = editData;
        tr.classList.add('active');
        this[state] = false;
    }

    onClickPage(event, index: number, filter) {
        if (this.currentPage == event.target.innerText || this.loadState) {
            return;
        }
        this.setPageNum(event.target.innerText, index);
        if (this.currentPage === event.target.innerText-1) {
            return;
        }
        this.pageNumber = event.target.innerText-1;
        this.getData(filter);
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
            document.querySelectorAll(this.cssClassPage).forEach((el: HTMLElement) => {
            if (this.currentPage-1 === Number.parseInt(el.innerText.match(/\d+/)[0])) {
                el.click();
            }
            });
        } else if (direction === 'RIGHT' && this.currentPage < this.totalPage) {
            document.querySelectorAll(this.cssClassPage).forEach((el: HTMLElement) => {
            const plusPage = this.currentPage + 1;
            if (plusPage == Number.parseInt(el.innerText.match(/\d+/)[0])) {
                el.click();
            }
            });
        }
    }


}