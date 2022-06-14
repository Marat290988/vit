import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductPreviewComponent } from './addproduct-preview.component';

describe('AddproductPreviewComponent', () => {
  let component: AddproductPreviewComponent;
  let fixture: ComponentFixture<AddproductPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddproductPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddproductPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
