import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-validators-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './custom-validators-form.component.html',
  styleUrls: ['./custom-validators-form.component.scss']
})
export class CustomValidatorsFormComponent implements OnInit {

  form!: FormGroup<IRegistrationForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createRegistrationForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Registration successful:', this.form.getRawValue());
      alert('Registration successful!\n\n' + JSON.stringify(this.form.getRawValue(), null, 2));
    } else {
      this.markAllFieldsAsTouched();
      alert('Please fix all validation errors before submitting.');
    }
  }

  onReset(): void {
    this.form.reset();
    this.form = this.createRegistrationForm();
  }

  private createRegistrationForm(): FormGroup<IRegistrationForm> {
    return this.fb.group<IRegistrationForm>({
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.noSpacesValidator(),
          this.alphanumericValidator()
        ]
      }),
      
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
          this.businessEmailValidator()
        ]
      }),
      
      phone: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          this.phoneNumberValidator()
        ]
      }),
      
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          this.strongPasswordValidator()
        ]
      }),
      
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      
      age: new FormControl(18, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(18),
          Validators.max(100),
          this.evenNumberValidator()  // Custom: must be even number
        ]
      }),
      
      website: new FormControl('', {
        nonNullable: true,
        validators: [this.urlValidator()]  // Optional but must be valid if provided
      }),
      
      bio: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.maxLength(500),
          this.noProfanityValidator(),
          this.minWordsValidator(10)
        ]
      }),
      
      favoriteColor: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          this.hexColorValidator()
        ]
      }),
      
      startDate: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          this.futureDateValidator()
        ]
      }),
      
      skills: new FormControl<string[]>([], {
        nonNullable: true,
        validators: [this.minArrayLengthValidator(2)]
      })
    }, {
      validators: [this.passwordMatchValidator()]  // Cross-field validator
    });
  }

  // Custom Validators
  private noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const hasSpaces = control.value.includes(' ');
      return hasSpaces ? { noSpaces: { message: 'Username cannot contain spaces' } } : null;
    };
  }

  private alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      const isValid = alphanumericRegex.test(control.value);
      return isValid ? null : { alphanumeric: { message: 'Username must contain only letters and numbers' } };
    };
  }

  private businessEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      // Allow common business domains but reject common personal email domains
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const email = control.value.toLowerCase();
      const domain = email.split('@')[1];
      
      if (personalDomains.includes(domain)) {
        return { businessEmail: { message: 'Please use a business email address' } };
      }
      
      return null;
    };
  }

  private phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      // US phone number format: (XXX) XXX-XXXX or XXX-XXX-XXXX
      const phoneRegex = /^(\(\d{3}\)\s?|\d{3}[-.]?)\d{3}[-.]?\d{4}$/;
      const isValid = phoneRegex.test(control.value);
      
      return isValid ? null : { phoneNumber: { message: 'Phone number must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX' } };
    };
  }

  private strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const password = control.value;
      const errors: any = {};
      
      // Check for uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.uppercase = 'Password must contain at least one uppercase letter';
      }
      
      // Check for lowercase letter
      if (!/[a-z]/.test(password)) {
        errors.lowercase = 'Password must contain at least one lowercase letter';
      }
      
      // Check for number
      if (!/\d/.test(password)) {
        errors.number = 'Password must contain at least one number';
      }
      
      // Check for special character
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.special = 'Password must contain at least one special character';
      }
      
      return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
    };
  }

  private evenNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const isEven = control.value % 2 === 0;
      return isEven ? null : { evenNumber: { message: 'Age must be an even number' } };
    };
  }

  private urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;  // Optional field
      
      try {
        new URL(control.value);
        return null;
      } catch {
        return { url: { message: 'Please enter a valid URL' } };
      }
    };
  }

  private noProfanityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const profanityWords = ['badword1', 'badword2', 'spam'];  // Add real profanity words as needed
      const text = control.value.toLowerCase();
      const hasProfanity = profanityWords.some(word => text.includes(word));
      
      return hasProfanity ? { profanity: { message: 'Bio contains inappropriate content' } } : null;
    };
  }

  private minWordsValidator(minWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const wordCount = control.value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      return wordCount >= minWords ? null : { minWords: { message: `Bio must contain at least ${minWords} words` } };
    };
  }

  private hexColorValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const isValid = hexColorRegex.test(control.value);
      
      return isValid ? null : { hexColor: { message: 'Color must be a valid hex code (e.g., #FF5733)' } };
    };
  }

  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // Reset time to beginning of day
      
      return selectedDate > today ? null : { futureDate: { message: 'Start date must be in the future' } };
    };
  }

  private minArrayLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) return null;
      
      return control.value.length >= minLength ? null : { minArrayLength: { message: `Please select at least ${minLength} skills` } };
    };
  }

  // Cross-field validator
  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      
      if (!password || !confirmPassword) return null;
      
      return password === confirmPassword ? null : { passwordMismatch: { message: 'Passwords do not match' } };
    };
  }

  // Helper methods for template
  getFieldError(fieldName: string, errorType: string): string | null {
    const field = this.form.get(fieldName);
    if (field?.errors && field.errors[errorType]) {
      const error = field.errors[errorType];
      return typeof error === 'string' ? error : error.message;
    }
    return null;
  }

  getStrongPasswordErrors(fieldName: string): string[] {
    const field = this.form.get(fieldName);
    if (field?.errors?.['strongPassword']) {
      return Object.values(field.errors['strongPassword']);
    }
    return [];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Skills management (for multi-select example)
  availableSkills = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'
  ];

  isSkillSelected(skill: string): boolean {
    const selectedSkills = this.form.get('skills')?.value || [];
    return selectedSkills.includes(skill);
  }

  onSkillChange(skill: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const skillsControl = this.form.get('skills') as FormControl<string[]>;
    const currentSkills = skillsControl.value || [];

    if (checkbox.checked) {
      skillsControl.setValue([...currentSkills, skill]);
    } else {
      skillsControl.setValue(currentSkills.filter(s => s !== skill));
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  // Helper methods for template validation display
  hasUppercase(password: string | undefined): boolean {
    return /[A-Z]/.test(password || '');
  }

  hasLowercase(password: string | undefined): boolean {
    return /[a-z]/.test(password || '');
  }

  hasNumber(password: string | undefined): boolean {
    return /\d/.test(password || '');
  }

  hasSpecialChar(password: string | undefined): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password || '');
  }

  getWordCount(text: string | undefined): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

// Form interface
export interface IRegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  age: FormControl<number>;
  website: FormControl<string>;
  bio: FormControl<string>;
  favoriteColor: FormControl<string>;
  startDate: FormControl<string>;
  skills: FormControl<string[]>;
}
