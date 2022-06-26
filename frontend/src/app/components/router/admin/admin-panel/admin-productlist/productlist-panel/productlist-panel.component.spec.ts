import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlistPanelComponent } from './productlist-panel.component';

describe('ProductlistPanelComponent', () => {
  let component: ProductlistPanelComponent;
  let fixture: ComponentFixture<ProductlistPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductlistPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductlistPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
