import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MqviewService {
  isLarge: boolean;
  isLarge$ = new BehaviorSubject<boolean>(this.isLarge);

  // set isLarge$ / isLarge values
  setIsLarge(value: boolean) {
    this.isLarge$.next(value);
    this.isLarge = value;
  }

  // getter to retrieve current value of isLarge
  get getIsLarge(): boolean {
    return this.isLarge;
  }

}
