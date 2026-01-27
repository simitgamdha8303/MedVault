import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRecords } from './share-records';

describe('ShareRecords', () => {
  let component: ShareRecords;
  let fixture: ComponentFixture<ShareRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
