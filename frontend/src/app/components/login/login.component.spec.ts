import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router';
import { throwError, TimeoutError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: {
    login: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset loading to false when registration fails with an error', () => {
    component.activeTab = 'register';
    component.regName = 'John Doe';
    component.regEmail = 'john@example.com';
    component.regPassword = 'password123';

    mockAuthService.register.mockReturnValue(
      throwError(() => ({ status: 409, error: { message: 'User with this email already exists.' } }))
    );

    component.onRegister();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('User with this email already exists.');
  });

  it('should reset loading to false and show timeout message on timeout', () => {
    component.activeTab = 'register';
    component.regName = 'Jane Doe';
    component.regEmail = 'jane@example.com';
    component.regPassword = 'password123';

    const timeoutErr = new TimeoutError();
    mockAuthService.register.mockReturnValue(throwError(() => timeoutErr));

    component.onRegister();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toContain('timed out');
  });

  it('should reset loading to false and handle status 0 (backend offline/cors error)', () => {
    component.activeTab = 'register';
    component.regName = 'John Doe';
    component.regEmail = 'john@example.com';
    component.regPassword = 'password123';

    mockAuthService.register.mockReturnValue(
      throwError(() => ({ status: 0 }))
    );

    component.onRegister();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toContain('Unable to connect to backend server');
  });
});
