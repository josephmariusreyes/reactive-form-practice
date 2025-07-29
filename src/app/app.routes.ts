import { Routes } from '@angular/router';
import { ReactiveFormBasicForm } from './reactive-form-basic-form/reactive-form-basic-form.component';
import { ReactiveFormBasicFormArray } from './reactive-form-basic-form-array/reactive-form-basic-form-array.component';
import { ReactiveFormUsingDIfferentKindOfFields } from './reactive-form-using-diffrent-kind-of-fields/reactive-form-using-diffrent-kind-of-fields.component';
import { RxjsPractice1Component } from './rxjs-practice1/rxjs-practice1.component';
import { DynamicNestedFormComponent } from './dynamic-nested-form/dynamic-nested-form.component';
import { CustomValidatorsFormComponent } from './custom-validators-form/custom-validators-form.component';
import { AsyncValidatorsFormComponent } from './async-validators-form/async-validators-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reactiveform-test1', pathMatch: 'full' },
  
  // Basic reactive form examples
  { 
    path: 'reactiveform-test1', 
    component: ReactiveFormBasicForm,
    title: 'Basic Form Array - Friends List'
  },
  { 
    path: 'reactiveform-test2', 
    component: ReactiveFormBasicFormArray,
    title: 'Advanced Form Array - Friends Management'
  },
  { 
    path: 'reactiveform-test3', 
    component: ReactiveFormUsingDIfferentKindOfFields,
    title: 'Different Field Types - User Profile'
  },

  // Advanced reactive form examples
  { 
    path: 'reactiveform-test4', 
    component: DynamicNestedFormComponent,
    title: 'Dynamic Nested Forms - Company & Employees'
  },
  { 
    path: 'reactiveform-test5', 
    component: CustomValidatorsFormComponent,
    title: 'Custom Validators - Registration Form'
  },
  { 
    path: 'reactiveform-test6', 
    component: AsyncValidatorsFormComponent,
    title: 'Async Validators - Account Setup'
  },

  // RxJS practice
  { 
    path: 'rxjs-test1', 
    component: RxjsPractice1Component,
    title: 'RxJS Practice'
  }
];
