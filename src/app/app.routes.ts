import { Routes } from '@angular/router';
import { ReactiveFormBasicForm } from '../reactive-form-basic-form/reactive-form-basic-form.component';
import { ReactiveFormBasicFormArray } from '../reactive-form-basic-form-array/reactive-form-basic-form-array.component';
import { ReactiveFormUsingDIfferentKindOfFields } from '../reactive-form-using-diffrent-kind-of-fields/reactive-form-using-diffrent-kind-of-fields.component';

export const routes: Routes = [
  { path: '', redirectTo: 'test1', pathMatch: 'full' },
  { path: 'test1', component: ReactiveFormBasicForm },
  { path: 'test2', component: ReactiveFormBasicFormArray },
  { path:'test3', component:ReactiveFormUsingDIfferentKindOfFields }
];
