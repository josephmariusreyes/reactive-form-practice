import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//mariustodo: this is work in progress
//test out having check boxes
//test out having radio boxes
//test out having drop down
//test out having date field
//reference back to the filter widget i create in auction for this
@Component({
  selector: 'reactive-form-using-diffrent-kind-of-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form-using-diffrent-kind-of-fields.component.html',
  styleUrls: ['./reactive-form-using-diffrent-kind-of-fields.component.scss']
})
export class ReactiveFormUsingDIfferentKindOfFields implements OnInit {

  form!: FormGroup<IFriendsForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const staticData: DtoFriends[] = [
      { name: 'Alice', age: 25, contactNo: '1234567890', work: 'Engineer', address: '123 Main St' },
      { name: 'Bob', age: 30, contactNo: '0987654321', work: 'Designer', address: '456 Park Ave' },
      { name: 'Charlie', age: 22, contactNo: '5555555555', work: 'Developer', address: '789 Broadway' }
    ];
    this.form = this.createFriendsForm(staticData);
  }

  get friendsArray(): FormArray<FormGroup<FriendForm>> {
    return this.form.get('friends') as FormArray<FormGroup<FriendForm>>;
  }

  onSubmit(): void {
    alert(JSON.stringify(this.form.getRawValue(), null, 2));
  }

  private createFriendsForm(data: DtoFriends[]): FormGroup<IFriendsForm> {
    const friendsFG = data.map(d => this.createFriendForm(d));
    return this.fb.group<IFriendsForm>({
      friends: this.fb.array<FormGroup<FriendForm>>(friendsFG)
    });
  }

  private createFriendForm(data: DtoFriends): FormGroup<FriendForm> {
    return new FormGroup<FriendForm>({
      name: new FormControl(data?.name ?? '', { nonNullable: true, validators: [Validators.required] }),
      age: new FormControl(data?.age ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
      contactNo: new FormControl(data?.contactNo ?? '', { nonNullable: true, validators: [Validators.required] }),
      work: new FormControl(data?.work ?? '', { nonNullable: true, validators: [Validators.required] }),
      address: new FormControl(data?.address ?? '', { nonNullable: true, validators: [Validators.required] })
    });
  }

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

  removeFriend(index: number): void {
    this.friendsArray.removeAt(index);
  }
}

//Api data model
export interface DtoFriends {
  name: string;
  age: number;
  contactNo: string;
  work: string;
  address: string;
}

//Form inteface
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