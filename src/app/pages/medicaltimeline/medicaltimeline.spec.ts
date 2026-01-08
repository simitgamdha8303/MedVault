import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medicaltimeline } from './medicaltimeline';

describe('Medicaltimeline', () => {
  let component: Medicaltimeline;
  let fixture: ComponentFixture<Medicaltimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicaltimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medicaltimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
