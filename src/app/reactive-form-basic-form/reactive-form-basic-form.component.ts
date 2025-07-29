import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'reactive-form-basic-form',
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './reactive-form-basic-form.component.html',
  styleUrl: './reactive-form-basic-form.component.scss'
})
export class ReactiveFormBasicForm implements OnInit {

  form!: FormGroup<IFriendsForm>;

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    const staticData:DtoFriends[] = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 22 }
    ];
    this.form = this.createFriendsForm(staticData);
  }
  
  get friendsArray() {
    return this.form.get('friends') as FormArray<FormGroup<FriendForm>>;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
      alert('Form submitted successfully!\n\n' + JSON.stringify(this.form.getRawValue(), null, 2));
    } else {
      this.markAllFieldsAsTouched();
      alert('Please fix the errors in the form before submitting.');
    }
  }
  
  // Helper method to mark all fields as touched for validation display
  private markAllFieldsAsTouched(): void {
    this.friendsArray.controls.forEach(control => {
      Object.keys(control.controls).forEach(key => {
        control.get(key)?.markAsTouched();
      });
    });
  }

  private createFriendsForm(data: { name: string; age: number }[]): FormGroup<IFriendsForm> {
    const friendsFG = data.map(d => this.createFriendForm(d));
    return this.fb.group<IFriendsForm>({
      friends: this.fb.array<FormGroup<FriendForm>>(friendsFG)
    });
  }  
  private createFriendForm(data:DtoFriends): FormGroup<FriendForm> {
    return new FormGroup<FriendForm>({
      name: new FormControl(data?.name ?? '', { 
        nonNullable: true, 
        validators: [Validators.required, Validators.minLength(2)] 
      }),
      age: new FormControl(data?.age ?? 0, { 
        nonNullable: true, 
        validators: [Validators.required, Validators.min(1), Validators.max(120)] 
      })
    });
  }
  
}

//dto from API
export interface DtoFriends {
  name:string;
  age:number;
}

//form interface
export interface IFriendsForm {
  friends: FormArray<FormGroup<FriendForm>>;
}
export interface FriendForm {
  name: FormControl<string>;
  age: FormControl<number>;
}