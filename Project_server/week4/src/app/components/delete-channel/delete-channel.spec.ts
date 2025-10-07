import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { FormsModule } from '@angular/forms';
import { DeleteChannel } from './delete-channel';

describe('DeleteChannel', () => {
  let component: DeleteChannel;
  let fixture: ComponentFixture<DeleteChannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteChannel, NavBar],
      imports: [HttpClientTestingModule, FormsModule]
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
