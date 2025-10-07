import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { CreateGroup } from '../create-group/create-group';
import { FormsModule } from '@angular/forms';
import { ApproveMember } from './approve-member';

describe('ApproveMember', () => {
  let component: ApproveMember;
  let fixture: ComponentFixture<ApproveMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveMember, NavBar],
      imports: [HttpClientTestingModule, FormsModule]
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
