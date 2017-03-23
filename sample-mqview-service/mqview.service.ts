import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MqviewService {
  isLarge: boolean;
  isLargeSource = new BehaviorSubject<boolean>(this.isLarge);

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
