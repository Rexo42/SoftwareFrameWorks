import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBar } from '../nav-bar/nav-bar';
import { CreateGroup } from '../create-group/create-group';
import { FormsModule } from '@angular/forms';
import { CreateAccount } from './create-account';

describe('CreateAccount', () => {
  let component: CreateAccount;
  let fixture: ComponentFixture<CreateAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccount,NavBar],
      imports: [HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should bind input fields to component properties', () => {
  const compiled = fixture.nativeElement as HTMLElement;

  const usernameInput = compiled.querySelector('input[name="username"]') as HTMLInputElement;
  const passwordInput = compiled.querySelector('input[name="password"]') as HTMLInputElement;
  const emailInput = compiled.querySelector('input[name="email"]') as HTMLInputElement;

  usernameInput.value = 'testuser';
  usernameInput.dispatchEvent(new Event('input'));

  passwordInput.value = '123456';
  passwordInput.dispatchEvent(new Event('input'));

  emailInput.value = 'test@example.com';
  emailInput.dispatchEvent(new Event('input'));

  expect(component.username).toBe('testuser');
  expect(component.password).toBe('123456');
  expect(component.email).toBe('test@example.com');
});
});
