import { Routes } from '@angular/router';
import { ReactiveFormTest1Component } from '../reactive-form-test-1/reactive-form-test-1.component';
import { ReactiveFormTest2Component } from '../reactive-form-test-2/reactive-form-test-2.component';
import { BasicFormInstantiation } from '../basic-form-instantiation/basic-form-instantiation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'test1', pathMatch: 'full' },
  { path: 'test1', component: ReactiveFormTest1Component },
  { path: 'test2', component: ReactiveFormTest2Component },
  { path:'basic-form-instantiation', component:BasicFormInstantiation }
];
