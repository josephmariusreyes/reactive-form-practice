import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-nested-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './dynamic-nested-form.component.html',
  styleUrls: ['./dynamic-nested-form.component.scss']
})
export class DynamicNestedFormComponent implements OnInit {

  form!: FormGroup<ICompanyForm>;
  currentYear = new Date().getFullYear();

  departments = [
    'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'
  ];

  skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createCompanyForm();
  }

  // Getters for form arrays
  get employeesArray(): FormArray<FormGroup<IEmployeeForm>> {
    return this.form.get('employees') as FormArray<FormGroup<IEmployeeForm>>;
  }

  getSkillsArray(employeeIndex: number): FormArray<FormGroup<ISkillForm>> {
    return this.employeesArray.at(employeeIndex).get('skills') as FormArray<FormGroup<ISkillForm>>;
  }

  // Employee management
  addEmployee(): void {
    const newEmployee = this.createEmployeeForm();
    this.employeesArray.push(newEmployee);
  }

  removeEmployee(index: number): void {
    if (this.employeesArray.length > 1) {
      this.employeesArray.removeAt(index);
    }
  }

  // Skill management
  addSkill(employeeIndex: number): void {
    const skillsArray = this.getSkillsArray(employeeIndex);
    const newSkill = this.createSkillForm();
    skillsArray.push(newSkill);
  }

  removeSkill(employeeIndex: number, skillIndex: number): void {
    const skillsArray = this.getSkillsArray(employeeIndex);
    if (skillsArray.length > 1) {
      skillsArray.removeAt(skillIndex);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Company data submitted:', this.form.getRawValue());
      alert('Company data saved successfully!\n\n' + JSON.stringify(this.form.getRawValue(), null, 2));
    } else {
      this.markAllFieldsAsTouched();
      alert('Please fix the errors in the form before submitting.');
    }
  }

  private createCompanyForm(): FormGroup<ICompanyForm> {
    return this.fb.group<ICompanyForm>({
      companyName: new FormControl('TechCorp Inc.', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      establishedYear: new FormControl(2020, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]
      }),
      headquarters: new FormControl('San Francisco, CA', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      employees: this.fb.array<FormGroup<IEmployeeForm>>([
        this.createEmployeeForm(),
        this.createEmployeeForm()
      ])
    });
  }

  private createEmployeeForm(): FormGroup<IEmployeeForm> {
    return this.fb.group<IEmployeeForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      department: new FormControl('Engineering', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      salary: new FormControl(75000, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(30000), Validators.max(500000)]
      }),
      startDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      isManager: new FormControl(false, {
        nonNullable: true
      }),
      skills: this.fb.array<FormGroup<ISkillForm>>([
        this.createSkillForm()
      ])
    });
  }

  private createSkillForm(): FormGroup<ISkillForm> {
    return this.fb.group<ISkillForm>({
      skillName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      level: new FormControl<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      yearsOfExperience: new FormControl(2, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(50)]
      })
    });
  }

  private markAllFieldsAsTouched(): void {
    // Mark company fields as touched
    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'employees') {
        this.form.get(key)?.markAsTouched();
      }
    });

    // Mark employee fields as touched
    this.employeesArray.controls.forEach(employeeControl => {
      Object.keys(employeeControl.controls).forEach(key => {
        if (key !== 'skills') {
          employeeControl.get(key)?.markAsTouched();
        }
      });

      // Mark skill fields as touched
      const skillsArray = employeeControl.get('skills') as FormArray<FormGroup<ISkillForm>>;
      skillsArray.controls.forEach(skillControl => {
        Object.keys(skillControl.controls).forEach(skillKey => {
          skillControl.get(skillKey)?.markAsTouched();
        });
      });
    });
  }
}

// Form interfaces
export interface ICompanyForm {
  companyName: FormControl<string>;
  establishedYear: FormControl<number>;
  headquarters: FormControl<string>;
  employees: FormArray<FormGroup<IEmployeeForm>>;
}

export interface IEmployeeForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  department: FormControl<string>;
  salary: FormControl<number>;
  startDate: FormControl<string>;
  isManager: FormControl<boolean>;
  skills: FormArray<FormGroup<ISkillForm>>;
}

export interface ISkillForm {
  skillName: FormControl<string>;
  level: FormControl<'beginner' | 'intermediate' | 'advanced' | 'expert'>;
  yearsOfExperience: FormControl<number>;
}
