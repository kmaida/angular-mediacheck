import { Component, OnInit } from '@angular/core';

import { MediacheckService } from './mediacheck.service';
import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-root',
  template: `
    <p><strong>View:</strong> {{mc.getMqName}}</p>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private mc: MediacheckService,
    private mqview: MqviewService
  ) { }

  ngOnInit() {
    // determine which media query is active on initial load and set
    this.mqview.setIsLarge(this.mc.check('large'));

    // set up listener for entering 'small' media query
    this.mc.onMqChange('small', (mql: MediaQueryList) => {
      this.mqview.setIsLarge(false);
    });

    // set up listener for entering 'large' media query
    this.mc.onMqChange('large', (mql: MediaQueryList) => {
      this.mqview.setIsLarge(true);
    });
  }

}
