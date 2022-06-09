import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddproductsComponent } from './admin-addproducts.component';

describe('AdminAddproductsComponent', () => {
  let component: AdminAddproductsComponent;
  let fixture: ComponentFixture<AdminAddproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddproductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
