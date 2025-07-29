import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'reactive-form-using-diffrent-kind-of-fields',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './reactive-form-using-diffrent-kind-of-fields.component.html',
  styleUrls: ['./reactive-form-using-diffrent-kind-of-fields.component.scss']
})
export class ReactiveFormUsingDIfferentKindOfFields implements OnInit {

  form!: FormGroup<IUserProfileForm>;

  // Options for dropdowns and checkboxes
  countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' }
  ];

  hobbies = [
    { value: 'reading', label: 'Reading' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'travel', label: 'Travel' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'gaming', label: 'Gaming' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createUserProfileForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
      alert('Profile saved successfully!\n\n' + JSON.stringify(this.form.getRawValue(), null, 2));
    } else {
      this.markAllFieldsAsTouched();
      alert('Please fix the errors in the form before submitting.');
    }
  }

  onReset(): void {
    this.form.reset();
    this.form = this.createUserProfileForm();
  }

  // Helper method to check if a hobby is selected
  isHobbySelected(hobby: string): boolean {
    const selectedHobbies = this.form.get('hobbies')?.value || [];
    return selectedHobbies.includes(hobby);
  }

  // Handle hobby checkbox changes
  onHobbyChange(hobby: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const hobbiesControl = this.form.get('hobbies') as FormControl<string[]>;
    const currentHobbies = hobbiesControl.value || [];

    if (checkbox.checked) {
      hobbiesControl.setValue([...currentHobbies, hobby]);
    } else {
      hobbiesControl.setValue(currentHobbies.filter(h => h !== hobby));
    }
  }

  private createUserProfileForm(): FormGroup<IUserProfileForm> {
    return this.fb.group<IUserProfileForm>({
      // Text input
      firstName: new FormControl('John', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      }),
      
      // Text input
      lastName: new FormControl('Doe', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      }),

      // Email input
      email: new FormControl('john.doe@example.com', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),

      // Password input
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)]
      }),

      // Number input
      age: new FormControl(25, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(18), Validators.max(120)]
      }),

      // Date input
      dateOfBirth: new FormControl('1998-01-01', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      // Select dropdown
      country: new FormControl('us', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      // Radio buttons
      gender: new FormControl<'male' | 'female' | 'other'>('male', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      // Textarea
      bio: new FormControl('Software developer with passion for clean code and user experience.', {
        nonNullable: true,
        validators: [Validators.maxLength(500)]
      }),

      // Checkbox array (multiple selections)
      hobbies: new FormControl<string[]>(['reading', 'music'], {
        nonNullable: true
      }),

      // Single checkbox
      newsletter: new FormControl(true, {
        nonNullable: true
      }),

      // Terms and conditions (required checkbox)
      agreeToTerms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue]
      }),

      // Range/slider input
      experience: new FormControl(5, {
        nonNullable: true,
        validators: [Validators.min(0), Validators.max(20)]
      }),

      // URL input
      website: new FormControl('https://johndoe.dev', {
        nonNullable: true,
        validators: [Validators.pattern(/^https?:\/\/.+/)]
      }),

      // Phone number
      phone: new FormControl('+1-555-123-4567', {
        nonNullable: true,
        validators: [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]
      })
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}

// Form interface
export interface IUserProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  age: FormControl<number>;
  dateOfBirth: FormControl<string>;
  country: FormControl<string>;
  gender: FormControl<'male' | 'female' | 'other'>;
  bio: FormControl<string>;
  hobbies: FormControl<string[]>;
  newsletter: FormControl<boolean>;
  agreeToTerms: FormControl<boolean>;
  experience: FormControl<number>;
  website: FormControl<string>;
  phone: FormControl<string>;
}