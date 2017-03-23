import { Component, OnInit } from '@angular/core';
import { MediacheckService } from './mediacheck.service';

@Component({
  selector: 'app-root',
  template: `
    <p *ngIf="isLarge">LARGE (we could show a sprawling data table)</p>
    <p *ngIf="!isLarge">SMALL (we could show a condensed list)</p>
    <app-child [isLarge]="isLarge"></app-child>
  `
})
export class AppComponent implements OnInit {
  // property to track large (or small) view
  isLarge: boolean;

  // make MediacheckService available in constructor
  constructor(private mc: MediacheckService) { }

  ngOnInit() {
    // determine which media query is active on initial load
    this.isLarge = this.mc.check('large');

    // set up listener for entering 'small' media query
    this.mc.onMqChange('small', (mql) => {
      this.showSmall(mql);
    });

    // set up listener for entering 'large' media query
    this.mc.onMqChange('large', (mql) => {
      this.showLarge(mql);
    });
  }

  showSmall(mql) {
    console.log(`Entering SMALL mq: ${mql.media}`);
    this.isLarge = false;
  }

  showLarge(mql: MediaQueryList) {
    console.log(`Entering LARGE mq: ${mql.media}`);
    this.isLarge = true;
  }

}
