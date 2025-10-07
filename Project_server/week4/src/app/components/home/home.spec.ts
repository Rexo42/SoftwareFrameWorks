import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { Home } from './home';
//import { HttpClient } from '@angular/common/http';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Home, NavBar],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });

  it('should set isLogged to true if currentUser exists in localStorage', () => {
  localStorage.setItem('currentUser', JSON.stringify({ username: 'test' }));
  component.ngOnInit();
  expect(component.isLogged).toBeTrue();
  });

  it('should set isLogged to false if currentUser does not exist in localStorage', () => {
  localStorage.removeItem('currentUser');
  component.ngOnInit();
  expect(component.isLogged).toBeFalse();
  });

  it('should show login button when user is not logged in', () => {
  component.isLogged = false;
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;
  const loginButton = compiled.querySelector('a.btn.btn-primary');
  expect(loginButton?.textContent).toContain('Login');

  const profileLink = compiled.querySelector('a[href="/profile"]');
  expect(profileLink).toBeNull(); // Should not show profile
});

  it('should show profile button when user is logged in', () => {
  component.isLogged = true;
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;
  const profileButton = compiled.querySelector('a.btn.btn-primary');
  expect(profileButton?.textContent).toContain('View Profile');

  const loginLink = compiled.querySelector('a[href="/login"]');
  expect(loginLink).toBeNull(); // Should not show login
});
});
