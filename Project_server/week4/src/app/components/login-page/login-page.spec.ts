import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login-page';
import { NavBar } from '../nav-bar/nav-bar';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiSpy: jasmine.SpyObj<Api>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const apiMock = jasmine.createSpyObj('Api', ['loginRequest', 'verifyToken']);
    

    await TestBed.configureTestingModule({
      declarations: [LoginPage, NavBar],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: Api, useValue: apiMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    apiSpy = TestBed.inject(Api) as jasmine.SpyObj<Api>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to /profile if currentUser is in localStorage on ngOnInit', () => {
    localStorage.setItem('currentUser', '"token123"');
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should login successfully and navigate to /profile', () => {
    const mockToken = 'abc123';
    apiSpy.loginRequest.and.returnValue(of({ success: true, token: mockToken }));

    component.username = 'testuser';
    component.password = 'testpass';
    component.login();

    expect(apiSpy.loginRequest).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    });

    expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockToken));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should show error message for invalid credentials', () => {
    apiSpy.loginRequest.and.returnValue(of({ success: false, token: '' }));

    component.username = 'testuser';
    component.password = 'wrongpass';
    component.login();

    expect(component.message).toBe('Invalid login credentials');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show server error message for 500 error', () => {
    apiSpy.loginRequest.and.returnValue(throwError(() => ({
      status: 500,
      error: {}
    })));

    component.username = 'testuser';
    component.password = 'testpass';
    component.login();

    expect(component.message).toBe('server error... please try again later');
  });

  it('should show API error message from 404', () => {
    const errorMessage = 'User not found';
    apiSpy.loginRequest.and.returnValue(throwError(() => ({
      status: 404,
      error: { message: errorMessage }
    })));

    component.username = 'missing';
    component.password = 'pass';
    component.login();

    expect(component.message).toBe(errorMessage);
  });
});