import { Injectable } from '@angular/core';

@Injectable()
export class MqviewService {
  isLarge: boolean;

  setIsLarge(value: boolean) {
    this.isLarge = value;
  }

  get getIsLarge(): boolean {
    return this.isLarge;
  }

}
