import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalAccess } from './patient-medical-access';

describe('PatientMedicalAccess', () => {
  let component: PatientMedicalAccess;
  let fixture: ComponentFixture<PatientMedicalAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMedicalAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMedicalAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
