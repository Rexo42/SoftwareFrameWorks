import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMember } from './approve-member';

describe('ApproveMember', () => {
  let component: ApproveMember;
  let fixture: ComponentFixture<ApproveMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
