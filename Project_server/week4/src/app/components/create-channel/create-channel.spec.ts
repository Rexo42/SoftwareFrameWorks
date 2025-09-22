import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannel } from './create-channel';

describe('CreateGroup', () => {
  let component: CreateChannel;
  let fixture: ComponentFixture<CreateChannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateChannel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChannel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
