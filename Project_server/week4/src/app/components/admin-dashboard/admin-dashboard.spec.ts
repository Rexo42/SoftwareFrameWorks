import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { CreateGroup } from '../create-group/create-group';
import { FormsModule } from '@angular/forms';
import { AdminDashboard } from './admin-dashboard';
import { DeleteChannel } from '../delete-channel/delete-channel';
import { CreateChannel } from '../create-channel/create-channel';
import { ApproveMember } from '../approve-member/approve-member';

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboard, NavBar, CreateGroup, DeleteChannel, CreateChannel, ApproveMember],
      imports: [HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
