import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChannel } from './delete-channel';

describe('DeleteChannel', () => {
  let component: DeleteChannel;
  let fixture: ComponentFixture<DeleteChannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteChannel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteChannel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
