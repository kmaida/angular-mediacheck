import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class MqviewService {
  // wait until a value is produced (1)
  private isLargeSource = new ReplaySubject<boolean>(1);
  isLarge: boolean;

  // isLarge subject - can be observed
  isLarge$ = this.isLargeSource;

  // set isLarge$ / isLarge values
  setIsLarge(value: boolean) {
    this.isLargeSource.next(value);
    this.isLarge = value;
  }

  // getter to retrieve current value of isLarge
  get getIsLarge(): boolean {
    return this.isLarge;
  }

}
