import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'reactive-form-basic-form',
  imports: [
    ReactiveFormsModule
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
    alert(JSON.stringify(this.form.getRawValue(), null, 2));
  }

  private createFriendsForm(data: { name: string; age: number }[]): FormGroup<IFriendsForm> {
    const friendsFG = data.map(d => this.createFriendForm(d));
    return this.fb.group<IFriendsForm>({
      friends: this.fb.array<FormGroup<FriendForm>>(friendsFG)
    });
  }  
  private createFriendForm(data:DtoFriends): FormGroup<FriendForm> {
    return new FormGroup<FriendForm>({
      name: new FormControl(data?.name ?? '', { nonNullable: true, validators: [Validators.required] }),
      age: new FormControl(data?.age ?? 0, { nonNullable: true, validators: [Validators.min(0)] })
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