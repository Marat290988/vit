import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductlistComponent } from './admin-productlist.component';

describe('AdminProductlistComponent', () => {
  let component: AdminProductlistComponent;
  let fixture: ComponentFixture<AdminProductlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProductlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
