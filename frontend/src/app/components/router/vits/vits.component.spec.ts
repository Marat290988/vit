import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitsComponent } from './vits.component';

describe('VitsComponent', () => {
  let component: VitsComponent;
  let fixture: ComponentFixture<VitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
