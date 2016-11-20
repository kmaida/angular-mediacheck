import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MediacheckService } from './mediacheck.service';
import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-home',
  template: `
    <div *ngIf="mqview.getIsLarge">Large</div>
    <div *ngIf="!mqview.getIsLarge">Small</div>
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
