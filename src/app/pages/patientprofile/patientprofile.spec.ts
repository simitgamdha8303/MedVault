import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Patientprofile } from './patientprofile';

describe('Patientprofile', () => {
  let component: Patientprofile;
  let fixture: ComponentFixture<Patientprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Patientprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Patientprofile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
