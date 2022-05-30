import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/pop-up/pop-up.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorMessage;

  constructor(
    private popupService: PopupService
  ) { 

  }

  ngOnInit(): void {
    this.errorMessage = this.popupService.errorMessage;
  }

}
