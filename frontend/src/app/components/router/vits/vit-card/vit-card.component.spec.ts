import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitCardComponent } from './vit-card.component';

describe('VitCardComponent', () => {
  let component: VitCardComponent;
  let fixture: ComponentFixture<VitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
