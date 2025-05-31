import { Routes } from '@angular/router';
import { ReactiveFormBasicForm } from './reactive-form-basic-form/reactive-form-basic-form.component';
import { ReactiveFormBasicFormArray } from './reactive-form-basic-form-array/reactive-form-basic-form-array.component';
import { ReactiveFormUsingDIfferentKindOfFields } from './reactive-form-using-diffrent-kind-of-fields/reactive-form-using-diffrent-kind-of-fields.component';
import { RxjsPractice1Component } from './rxjs-practice1/rxjs-practice1.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reactiveform-test1', pathMatch: 'full' },
  
  //reactive form tests
  { path: 'reactiveform-test1', component: ReactiveFormBasicForm },
  { path: 'reactiveform-test2', component: ReactiveFormBasicFormArray },
  { path: 'reactiveform-test3', component:ReactiveFormUsingDIfferentKindOfFields },

  //
  { path: 'rxjs-test1', component:RxjsPractice1Component }
];
