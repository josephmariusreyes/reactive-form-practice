import { Component } from '@angular/core';
import { of, from, Observable } from 'rxjs';
import { delay, mergeMap, switchMap, concatMap, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-practice1',
  imports: [],
  templateUrl: './rxjs-practice1.component.html',
  styleUrl: './rxjs-practice1.component.scss'
})
export class RxjsPractice1Component {

  // Simulate an HTTP request
  fakeHttpRequest(val: string): Observable<string> {
    return of(`Response for ${val}`).pipe(delay(1000));
  }

  // mergeMap example
  testMergeMap() {
    from(['A', 'B', 'C'])
      .pipe(
        mergeMap(val => this.fakeHttpRequest(val))
      )
      .subscribe(res => console.log('mergeMap:', res));
  }

  // switchMap example
  testSwitchMap() {
    from(['A', 'B', 'C'])
      .pipe(
        switchMap(val => this.fakeHttpRequest(val))
      )
      .subscribe(res => console.log('switchMap:', res));
  }

  // concatMap example
  testConcatMap() {
    from(['A', 'B', 'C'])
      .pipe(
        concatMap(val => this.fakeHttpRequest(val))
      )
      .subscribe(res => console.log('concatMap:', res));
  }

  // exhaustMap example
  testExhaustMap() {
    from(['A', 'B', 'C'])
      .pipe(
        exhaustMap(val => this.fakeHttpRequest(val))
      )
      .subscribe(res => console.log('exhaustMap:', res));
  }
}