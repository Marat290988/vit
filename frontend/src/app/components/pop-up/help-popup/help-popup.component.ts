import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentRef } from '@angular/core';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';
import { SureComponent } from './../../../components/pop-up/sure/sure.component';

@Component({
  selector: 'app-help-popup',
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.css']
})
export class HelpPopupComponent implements OnInit {

  @ViewChild('helpPopupCont') helpPopupCont: ElementRef;
  @ViewChild('dynamic', { read: ViewContainerRef })
  private viewRef: ViewContainerRef;

  constructor(
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.popupService.subject.subscribe((data: {component: any, state: boolean}) => {
      if (data) {
        if (data.component) {
          this.showHelpWindow(data.component);
        } else if (data.component === null) {
          this.removeHelpWindow();
        }
      }
    })
  }

  showHelpWindow(component) {
    this.helpPopupCont.nativeElement.style.display = 'flex';
    setTimeout(()=> {
      this.helpPopupCont.nativeElement.style.background = '#25afa25e';
    });
    this.viewRef.clear();
    this.viewRef.createComponent(component);
  }

  removeHelpWindow() {
    this.viewRef.clear();
    this.helpPopupCont.nativeElement.style.display = '';
    this.helpPopupCont.nativeElement.style.background = '';
  }

}
