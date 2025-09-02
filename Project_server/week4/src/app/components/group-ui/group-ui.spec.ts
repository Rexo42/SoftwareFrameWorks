import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUI } from './group-ui';

describe('GroupUI', () => {
  let component: GroupUI;
  let fixture: ComponentFixture<GroupUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupUI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupUI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
