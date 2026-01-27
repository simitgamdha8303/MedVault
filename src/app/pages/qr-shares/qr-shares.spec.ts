import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrShares } from './qr-shares';

describe('QrShares', () => {
  let component: QrShares;
  let fixture: ComponentFixture<QrShares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrShares]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrShares);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
