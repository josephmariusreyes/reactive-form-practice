import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form-test-2',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './reactive-form-test-2.component.html',
  styleUrls: ['./reactive-form-test-2.component.scss']
})
export class ReactiveFormTest2Component implements OnInit {

  form!: FormGroup<IFriendsForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const staticData: DtoFriends[] = [
      { 
        name: 'Alice', 
        age: 25,
        contactNo: '1234567890',
        work: 'Engineer',
        address: '123 Main St'
      },
      { 
        name: 'Bob', 
        age: 30,
        contactNo: '0987654321',
        work: 'Designer',
        address: '456 Park Ave'
      },
      { 
        name: 'Charlie', 
        age: 22,
        contactNo: '5555555555',
        work: 'Developer',
        address: '789 Broadway'
      }
    ];
    this.form = this.createFriendsForm(staticData);
  }
  
  get friendsArray(): FormArray<FormGroup<FriendForm>> {
    return this.form.get('friends') as FormArray<FormGroup<FriendForm>>;
  }

  onSubmit(): void {
    alert(JSON.stringify(this.form.getRawValue(), null, 2));
  }

  // Create a form group for all friends based on an array of DtoFriends objects.
  private createFriendsForm(data: DtoFriends[]): FormGroup<IFriendsForm> {
    const friendsFG = data.map(d => this.createFriendForm(d));
    return this.fb.group<IFriendsForm>({
      friends: this.fb.array<FormGroup<FriendForm>>(friendsFG)
    });
  }  

  // Create a form group for a single friend with additional fields.
  private createFriendForm(data: DtoFriends): FormGroup<FriendForm> {
    return new FormGroup<FriendForm>({
      name: new FormControl(data?.name ?? '', { nonNullable: true, validators: [Validators.required] }),
      age: new FormControl(data?.age ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
      contactNo: new FormControl(data?.contactNo ?? '', { nonNullable: true, validators: [Validators.required] }),
      work: new FormControl(data?.work ?? '', { nonNullable: true, validators: [Validators.required] }),
      address: new FormControl(data?.address ?? '', { nonNullable: true, validators: [Validators.required] })
    });
  }
  
  // Add a new friend FormGroup to the FormArray.
  addFriend(): void {
    const newFriend: DtoFriends = {
      name: '',
      age: 0,
      contactNo: '',
      work: '',
      address: ''
    };
    this.friendsArray.push(this.createFriendForm(newFriend));
  }

  // Remove a friend FormGroup from the FormArray at a given index.
  removeFriend(index: number): void {
    this.friendsArray.removeAt(index);
  }
}

// Updated DTO from API including new fields.
export interface DtoFriends {
  name: string;
  age: number;
  contactNo: string;
  work: string;
  address: string;
}

// Updated form interface
export interface IFriendsForm {
  friends: FormArray<FormGroup<FriendForm>>;
}

export interface FriendForm {
  name: FormControl<string>;
  age: FormControl<number>;
  contactNo: FormControl<string>;
  work: FormControl<string>;
  address: FormControl<string>;
}
