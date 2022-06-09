import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-addproducts',
  templateUrl: './admin-addproducts.component.html',
  styleUrls: ['./admin-addproducts.component.css', '../../../../../../assets/styles/form.css']
})
export class AdminAddproductsComponent implements OnInit {

  formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
