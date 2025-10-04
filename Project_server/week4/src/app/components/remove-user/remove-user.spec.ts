import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUser } from './remove-user';

describe('RemoveUser', () => {
  let component: RemoveUser;
  let fixture: ComponentFixture<RemoveUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
