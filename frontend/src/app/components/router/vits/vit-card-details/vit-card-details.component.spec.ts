import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitCardDetailsComponent } from './vit-card-details.component';

describe('VitCardDetailsComponent', () => {
  let component: VitCardDetailsComponent;
  let fixture: ComponentFixture<VitCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
