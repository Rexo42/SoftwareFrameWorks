import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroup } from './delete-group';

describe('DeleteGroup', () => {
  let component: DeleteGroup;
  let fixture: ComponentFixture<DeleteGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
