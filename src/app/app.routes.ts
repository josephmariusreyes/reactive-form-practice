import { Routes } from '@angular/router';
import { ReactiveFormTest1Component } from '../reactive-form-test-1/reactive-form-test-1.component';

export const routes: Routes = [
  { path: '', redirectTo: 'test1', pathMatch: 'full' },
  { path: 'test1', component: ReactiveFormTest1Component }
];
