import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doctorprofile } from './doctorprofile';

describe('Doctorprofile', () => {
  let component: Doctorprofile;
  let fixture: ComponentFixture<Doctorprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doctorprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Doctorprofile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
