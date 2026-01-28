import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrViewDialog } from './qr-view-dialog';

describe('QrViewDialog', () => {
  let component: QrViewDialog;
  let fixture: ComponentFixture<QrViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrViewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
