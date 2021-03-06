import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, map, Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { Observable } from 'rxjs';
import { PopupMessageService } from './../../../../../../services/pop-up/popup-message.service';

export interface SearchFilter {
  product: string,
  catListSelected: string[],
  manListSelected: string [],
  minPrice: string,
  maxPrice: string
}

@Component({
  selector: 'app-productlist-panel',
  templateUrl: './productlist-panel.component.html',
  styleUrls: ['./productlist-panel.component.css', '../../../../../../../assets/styles/form.css']
})
export class ProductlistPanelComponent implements OnInit {

  searchInputSubs: Subscription;
  windowClickEventSubs: Subscription;
  filterData: SearchFilter = {
    product: '',
    catListSelected: [],
    manListSelected: [],
    minPrice: null,
    maxPrice: null
  };
  @Output() searchEmit = new EventEmitter<SearchFilter>();
  @Output() selectNumOfRow = new EventEmitter<number>();
  @Output() delEmit = new EventEmitter();
  @Output() editEmit = new EventEmitter();
  @Input() adminAction = true;
  @Input() buttonState = false;
  catList = [];
  catListComponent = [];
  catListSelected = [];
  manList = [];
  manListComponent = [];
  manListSelected = [];
  windowCliclEvent$: Observable<any> = fromEvent(window, 'click').pipe(
    map(event => event.target)
  );
  linkTimeout;
  

  constructor(
    private productService: ProductService,
    private popupMessageService: PopupMessageService
  ) { }

  ngOnInit(): void {
    this.searchInputSubs = fromEvent(document.getElementById('product-search'), 'input').pipe(
      map((event: any) => event.target.value)
    ).subscribe(input => {
      this.filterData.product = input;
      this.searchEmit.emit(this.filterData);
    });
  }

  ngOnDestroy() {
    this.searchInputSubs.unsubscribe();
  }

  //Set list with prompt (category, manufacturer)
  onInputForPrompt(event, list: string, listBase: string) {
    if (event.target.value.length >= 2) {
      if (this[list + 'Selected'].length === 0 && this[list + 'Component'].length !== this.productService[listBase].length) {
        this[list + 'Component'] = [...this.productService[listBase]];
      }
      this[list] = this[list + 'Component'].filter(el => el.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      if (this[list].length > 0) {
        if (!this.windowClickEventSubs || this.windowClickEventSubs.closed) {
          this.windowClickEventSubs = this.windowCliclEvent$.subscribe(target => {
            if (target.closest(`[data-filter="${list}"]`)) {
              // console.log('open')
            } else {
              this[list] = [];
              this.windowClickEventSubs.unsubscribe();
            }
          })
        }
      }
    } else {
      this[list] = [];
    }
  }

  //Fill selected filter list
  onPickPrompt(list, index: number, selectedList: string, inputEl: HTMLInputElement) {
    if (this[selectedList].length > 3) {
      this.popupMessageService.showMessage('Number of filters maximum 5');
      return;
    }
    const indexComponent = this[list + 'Component'].indexOf(this[list][index]);
    setTimeout(() => {
      this[selectedList].push(this[list].splice(index, 1)[0]);
      this[list + 'Component'].splice(indexComponent, 1);
      this.filterData[selectedList] = [...this[selectedList]];
      this.searchEmit.emit(this.filterData);
      this[list] = [];
      inputEl.value = '';
    }, 100);
  }

  removeSelectedFilter(index: number, list: string) {
    this[list + 'Component'].push(this[list + 'Selected'].splice(index, 1)[0]);
    this.filterData[list + 'Selected'] = this[list + 'Selected'];
    this.searchEmit.emit(this.filterData);
  }

  setPrice(typePrice: string, event) {
    if (event.data === '.') {
      return;
    }
    if (event.target.value.match(/^0\d/)) {
      event.target.value = event.target.value.slice(1, event.target.value.length);
    }
    const price = parseFloat(event.target.value).toFixed(2);
    this.filterData[typePrice + 'Price'] = event.target.value === '' ? null :  price;
    this.searchEmit.emit(this.filterData);
  }

  onSelectChange(event) {
    this.selectNumOfRow.emit(event.target.value);
  }

  expandSearchPanel() {
    const arrow: HTMLElement = document.querySelector('.panel-arrow-down');
    const panel: HTMLElement = document.querySelector('.productlist-panel-inner');
    if (arrow.classList.contains('active')) {
      clearTimeout(this.linkTimeout);
      arrow.classList.remove('active');
      panel.style.height = `${panel.getBoundingClientRect().height}px`;
      this.linkTimeout =  setTimeout(() => {
        panel.style.height = '47px';
      }, 100)
    } else {
      clearTimeout(this.linkTimeout);
      arrow.classList.add('active');
      panel.style.height = `${panel.scrollHeight}px`;
      this.linkTimeout = setTimeout(() => {
        panel.style.height = 'unset';
      }, 500);
    }
  }

}
