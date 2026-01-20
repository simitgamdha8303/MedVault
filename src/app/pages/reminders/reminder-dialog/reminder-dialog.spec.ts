import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderDialog } from './reminder-dialog';

describe('ReminderDialog', () => {
  let component: ReminderDialog;
  let fixture: ComponentFixture<ReminderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
