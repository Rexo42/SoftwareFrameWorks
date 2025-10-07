import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { FormsModule } from '@angular/forms';
import { CreateGroup } from './create-group';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

describe('CreateGroup', () => {
  let component: CreateGroup;
  let fixture: ComponentFixture<CreateGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGroup, NavBar],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [Api, { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
