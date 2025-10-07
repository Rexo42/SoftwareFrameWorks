import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Profile } from './profile';
import { NavBar } from '../nav-bar/nav-bar';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Profile Component', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let apiSpy: jasmine.SpyObj<Api>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiMock = jasmine.createSpyObj('Api', ['verifyToken', 'updateProfileRequest']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [Profile, NavBar],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Api, useValue: apiMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    apiSpy = TestBed.inject(Api) as jasmine.SpyObj<Api>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if no token found', () => {
    localStorage.removeItem('currentUser');
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call verifyToken and populate form on success', () => {
    const mockResponse = {
      valid: true,
      username: 'user1',
      email: 'user1@example.com',
      age: '25',
      birthdate: '1999-01-01',
      profilePicture: 'pic.jpg',
      role: ''
    };

    localStorage.setItem('currentUser', '"token123"');
    apiSpy.verifyToken.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(apiSpy.verifyToken).toHaveBeenCalledWith('token123');
    expect(component.profileForm.value.username).toBe('user1');
    expect(component.profilePicture).toBe('pic.jpg');
  });

  it('should redirect to home on invalid token', () => {
      const mockResponse = {
    valid: false,
    role: '',
    username: '',
    email: '',
    age: '',
    birthdate: '',
    profilePicture: ''
  };
    localStorage.setItem('currentUser', '"token123"');
    apiSpy.verifyToken.and.returnValue(of(mockResponse));

    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should update selected file when onFileSelected is triggered', () => {
    const dummyFile = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [dummyFile]
      }
    } as unknown as Event;

    component.onFileSelected(event);
    expect(component.selectedFile).toBe(dummyFile);
  });

  it('should submit form and update profile picture on success', fakeAsync(() => {
    const token = '"token123"';
    localStorage.setItem('currentUser', token);

     const verifyResponse = {
    valid: true,
    username: 'test',
    email: 'test@example.com',
    age: '30',
    birthdate: '1990-01-01',
    role: 'user',
    profilePicture: 'old-pic.jpg'
  };
    const mockResponse = {
      success: true,
      message: 'Updated',
      profilePicture: 'new-pic.jpg'
    };
    apiSpy.verifyToken.and.returnValue(of(verifyResponse));
    apiSpy.updateProfileRequest.and.returnValue(of(mockResponse));

    component.ngOnInit();
    tick();

    component.profileForm.setValue({
      username: 'test',
      email: 'test@example.com',
      age: '30',
      birthdate: '1990-01-01',
      profilePicture: ''
    });

    const dummyFile = new File([''], 'test.png', { type: 'image/png' });
    component.selectedFile = dummyFile;

    component.onSubmit();
    tick();

    expect(apiSpy.updateProfileRequest).toHaveBeenCalled();
    expect(component.message).toBe('Profile Updated Successfully!');
    expect(component.profilePicture).toBe('new-pic.jpg');
    expect(component.selectedFile).toBeNull();
  }));

  it('should show error message and redirect on updateProfileRequest failure (success false)', fakeAsync(() => {
    const token = '"token123"';
    localStorage.setItem('currentUser', token);

    const mockError = {
      success: false,
      message: 'Failed to update',
      profilePicture: 'None',
    };
    const mockVerifyResponse = {
    valid: true,
    role: 'user',
    username: 'test',
    email: 'test@example.com',
    age: '30',
    birthdate: '1990-01-01',
    profilePicture: ''
  }

    apiSpy.updateProfileRequest.and.returnValue(of(mockError));
    apiSpy.verifyToken.and.returnValue(of(mockVerifyResponse));

    component.ngOnInit();
    tick();

    component.profileForm.setValue({
      username: 'test',
      email: 'test@example.com',
      age: '30',
      birthdate: '1990-01-01',
      profilePicture: ''
    });

    component.onSubmit();
    tick();

    expect(component.message).toBe('Failed to update');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));
});