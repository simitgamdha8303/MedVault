import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileDialog } from './myprofile-dialog';

describe('MyprofileDialog', () => {
  let component: MyprofileDialog;
  let fixture: ComponentFixture<MyprofileDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyprofileDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyprofileDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
