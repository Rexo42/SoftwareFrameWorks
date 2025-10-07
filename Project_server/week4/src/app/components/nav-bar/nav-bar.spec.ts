import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavBar } from './nav-bar';
import { of, throwError } from 'rxjs';
import { Api } from '../../services/api';

describe('NavBar', () => {
  let component: NavBar;
  let fixture: ComponentFixture<NavBar>;
  let apiSpy: jasmine.SpyObj<Api>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiMock = jasmine.createSpyObj('Api', ['verifyToken']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [NavBar],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Api, useValue: apiMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBar);
    component = fixture.componentInstance;
    apiSpy = TestBed.inject(Api) as jasmine.SpyObj<Api>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT set user info if no token is found', () => {
    localStorage.removeItem('currentUser');
    component.ngOnInit();
    expect(component.isLoggedIn).toBeFalse();
  });

  it('should set user info if token is valid', fakeAsync(() => {
    const mockResponse = {
      valid: true,
      role: 'User',
      username: 'john',
      email: '',
      age: '',
      birthdate: '',
      profilePicture: ''
    };

    localStorage.setItem('currentUser', '"valid-token"');
    apiSpy.verifyToken.and.returnValue(of(mockResponse));

    component.ngOnInit();
    tick();

    expect(component.isLoggedIn).toBeTrue();
    expect(apiSpy.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(component.user).toBe('john');
    expect(component.role).toBe('User');
    expect(component.isSuperAdmin).toBeFalse();
  }));

  it('should detect SuperAdmin user and set isSuperAdmin = true', fakeAsync(() => {
    const mockResponse = {
      valid: true,
      role: 'SuperAdmin',
      username: 'adminUser',
      email: '',
      age: '',
      birthdate: '',
      profilePicture: ''
    };

    localStorage.setItem('currentUser', '"super-token"');
    apiSpy.verifyToken.and.returnValue(of(mockResponse));

    component.ngOnInit();
    tick();

    expect(component.isSuperAdmin).toBeTrue();
    expect(component.user).toBe('adminUser');
    expect(component.role).toBe('SuperAdmin');
  }));

  it('should handle token verification error gracefully', fakeAsync(() => {
    localStorage.setItem('currentUser', '"broken-token"');
    const mockError = { status: 401, error: { message: 'Invalid token' } };

    apiSpy.verifyToken.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error');
    component.ngOnInit();
    tick();

    expect(console.error).toHaveBeenCalledWith('error validating user Token: ', mockError);
  }));

  it('should logout and navigate to /home', () => {
    localStorage.setItem('currentUser', '"some-token"');
    component.isLoggedIn = true;

    component.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(component.isLoggedIn).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /login on create()', () => {
    component.create();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
