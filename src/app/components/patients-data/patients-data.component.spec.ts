import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsDataComponent } from './patients-data.component';

describe('PatientsDataComponent', () => {
  let component: PatientsDataComponent;
  let fixture: ComponentFixture<PatientsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
