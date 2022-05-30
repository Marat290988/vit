import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';

@Component({
  selector: 'app-sure',
  templateUrl: './sure.component.html',
  styleUrls: ['./sure.component.css']
})
export class SureComponent implements OnInit {

  constructor(
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

  yes() {
    this.popupService.confirm();
  }

  cancel() {
    this.popupService.cancel();
  }

}
