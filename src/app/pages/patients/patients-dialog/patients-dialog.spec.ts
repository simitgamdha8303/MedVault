import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsDialog } from './patients-dialog';

describe('PatientsDialog', () => {
  let component: PatientsDialog;
  let fixture: ComponentFixture<PatientsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
