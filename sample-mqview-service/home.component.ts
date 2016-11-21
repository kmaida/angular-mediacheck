import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-home',
  template: `
    <div *ngIf="mqview.getIsLarge">Show desktop template</div>
    <div *ngIf="!mqview.getIsLarge">Show mobile template</div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  mqSub: Subscription;
  
  constructor(private mqview: MqviewService) { }

  ngOnInit() {
    // subscribe to isLarge$ subject
    this.mqSub = this.mqview.isLarge$.subscribe(
      isLarge => {
        // do something based on the updated value of isLarge
        console.log('mqview isLarge changed:', isLarge);
      }
    );
  }

  ngOnDestroy() {
    // prevent memory leaks
    this.mqSub.unsubscribe();
  }

}
