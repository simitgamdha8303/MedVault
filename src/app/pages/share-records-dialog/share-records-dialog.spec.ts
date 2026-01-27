import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRecordsDialog } from './share-records-dialog';

describe('ShareRecordsDialog', () => {
  let component: ShareRecordsDialog;
  let fixture: ComponentFixture<ShareRecordsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareRecordsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareRecordsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
