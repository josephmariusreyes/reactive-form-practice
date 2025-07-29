import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-async-validators-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './async-validators-form.component.html',
  styleUrls: ['./async-validators-form.component.scss']
})
export class AsyncValidatorsFormComponent implements OnInit {

  form!: FormGroup<IUserAccountForm>;
  isLoading = false;

  // Simulated existing data for async validation
  private existingUsernames = ['admin', 'user123', 'testuser', 'john_doe', 'jane_smith'];
  private existingEmails = ['admin@company.com', 'test@company.com', 'user@company.com'];
  private reservedDomains = ['example.com', 'test.com', 'invalid.com'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createUserAccountForm();
  }

  onSubmit(): void {
    this.isLoading = true;
    
    if (this.form.valid) {
      // Simulate API call
      timer(2000).subscribe(() => {
        this.isLoading = false;
        console.log('Account created:', this.form.getRawValue());
        alert('Account created successfully!\n\n' + JSON.stringify(this.form.getRawValue(), null, 2));
      });
    } else {
      this.isLoading = false;
      this.markAllFieldsAsTouched();
      alert('Please fix all validation errors before submitting.');
    }
  }

  private createUserAccountForm(): FormGroup<IUserAccountForm> {
    return this.fb.group<IUserAccountForm>({
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/)
        ],
        asyncValidators: [this.usernameAsyncValidator()]
      }),
      
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: [this.emailAsyncValidator()]
      }),
      
      companyDomain: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)
        ],
        asyncValidators: [this.domainAvailabilityValidator()]
      }),
      
      apiKey: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
        asyncValidators: [this.apiKeyValidator()]
      }),
      
      repositoryUrl: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/^https:\/\/github\.com\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/)
        ],
        asyncValidators: [this.repositoryExistsValidator()]
      }),
      
      phoneNumber: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/^\+?[1-9]\d{1,14}$/)
        ],
        asyncValidators: [this.phoneNumberValidator()]
      })
    });
  }

  // Async Validators
  private usernameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simulate API call with delay
      return timer(800).pipe(
        switchMap(() => {
          // Simulate checking against database
          const isUsernameExists = this.existingUsernames.includes(control.value.toLowerCase());
          
          if (isUsernameExists) {
            return of({ 
              usernameExists: { 
                message: 'This username is already taken' 
              } 
            });
          }
          
          return of(null);
        })
      );
    };
  }

  private emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.includes('@')) {
        return of(null);
      }

      return timer(1000).pipe(
        switchMap(() => {
          const email = control.value.toLowerCase();
          const isEmailExists = this.existingEmails.includes(email);
          
          if (isEmailExists) {
            return of({ 
              emailExists: { 
                message: 'This email is already registered' 
              } 
            });
          }
          
          // Check if it's a disposable email domain
          const domain = email.split('@')[1];
          const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
          
          if (disposableDomains.includes(domain)) {
            return of({ 
              disposableEmail: { 
                message: 'Disposable email addresses are not allowed' 
              } 
            });
          }
          
          return of(null);
        })
      );
    };
  }

  private domainAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(1200).pipe(
        switchMap(() => {
          const domain = control.value.toLowerCase();
          
          // Check if domain is reserved
          if (this.reservedDomains.includes(domain)) {
            return of({ 
              domainReserved: { 
                message: 'This domain is reserved and cannot be used' 
              } 
            });
          }
          
          // Simulate DNS lookup
          const isDomainTaken = Math.random() > 0.7; // 30% chance domain is available
          
          if (isDomainTaken) {
            return of({ 
              domainTaken: { 
                message: 'This domain is already registered' 
              } 
            });
          }
          
          return of(null);
        }),
        catchError(() => {
          return of({ 
            domainError: { 
              message: 'Unable to verify domain availability' 
            } 
          });
        })
      );
    };
  }

  private apiKeyValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(600).pipe(
        switchMap(() => {
          // Simulate API key validation
          const apiKey = control.value;
          
          // Check format (should be 32 characters hex)
          if (!/^[a-fA-F0-9]{32}$/.test(apiKey)) {
            return of({ 
              invalidApiKeyFormat: { 
                message: 'API key must be 32 hexadecimal characters' 
              } 
            });
          }
          
          // Simulate checking if API key is active
          const isKeyActive = Math.random() > 0.3; // 70% chance key is active
          
          if (!isKeyActive) {
            return of({ 
              inactiveApiKey: { 
                message: 'This API key is inactive or invalid' 
              } 
            });
          }
          
          return of(null);
        })
      );
    };
  }

  private repositoryExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(1500).pipe(
        switchMap(() => {
          // Simulate GitHub API call
          const repoExists = Math.random() > 0.5; // 50% chance repo exists
          
          if (!repoExists) {
            return of({ 
              repositoryNotFound: { 
                message: 'Repository not found or is private' 
              } 
            });
          }
          
          // Check if repository has required files
          const hasRequiredFiles = Math.random() > 0.3; // 70% chance has required files
          
          if (!hasRequiredFiles) {
            return of({ 
              missingRequiredFiles: { 
                message: 'Repository must contain package.json and README.md' 
              } 
            });
          }
          
          return of(null);
        }),
        catchError(() => {
          return of({ 
            repositoryError: { 
              message: 'Unable to verify repository' 
            } 
          });
        })
      );
    };
  }

  private phoneNumberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(900).pipe(
        switchMap(() => {
          // Simulate phone number validation service
          const phoneNumber = control.value.replace(/\D/g, ''); // Remove non-digits
          
          // Check if number is from a valid carrier
          const invalidCarriers = ['555', '800', '888', '877'];
          const areaCode = phoneNumber.substring(0, 3);
          
          if (invalidCarriers.includes(areaCode)) {
            return of({ 
              invalidCarrier: { 
                message: 'Phone number from this carrier is not supported' 
              } 
            });
          }
          
          // Simulate checking if number is already in use
          const isNumberInUse = Math.random() > 0.8; // 20% chance number is in use
          
          if (isNumberInUse) {
            return of({ 
              phoneNumberInUse: { 
                message: 'This phone number is already associated with another account' 
              } 
            });
          }
          
          return of(null);
        })
      );
    };
  }

  // Helper methods for template
  isFieldValidating(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.pending);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string, errorType: string): string | null {
    const field = this.form.get(fieldName);
    if (field?.errors && field.errors[errorType]) {
      const error = field.errors[errorType];
      return typeof error === 'string' ? error : error.message;
    }
    return null;
  }

  generateApiKey(): void {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    this.form.get('apiKey')?.setValue(result);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}

// Form interface
export interface IUserAccountForm {
  username: FormControl<string>;
  email: FormControl<string>;
  companyDomain: FormControl<string>;
  apiKey: FormControl<string>;
  repositoryUrl: FormControl<string>;
  phoneNumber: FormControl<string>;
}
