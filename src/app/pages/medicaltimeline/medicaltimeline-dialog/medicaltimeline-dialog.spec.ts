import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaltimelineDialog } from './medicaltimeline-dialog';

describe('AddMedicaltimelineDialog', () => {
  let component: MedicaltimelineDialog;
  let fixture: ComponentFixture<MedicaltimelineDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicaltimelineDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicaltimelineDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
