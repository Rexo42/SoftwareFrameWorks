import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { FormsModule } from '@angular/forms';
import { ChatRooms } from './chat-rooms';

describe('ChatRooms', () => {
  let component: ChatRooms;
  let fixture: ComponentFixture<ChatRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRooms, NavBar],
      imports: [HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRooms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
