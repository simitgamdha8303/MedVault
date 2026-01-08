import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicaltimelineDialog } from './add-medicaltimeline-dialog';

describe('AddMedicaltimelineDialog', () => {
  let component: AddMedicaltimelineDialog;
  let fixture: ComponentFixture<AddMedicaltimelineDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicaltimelineDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicaltimelineDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
