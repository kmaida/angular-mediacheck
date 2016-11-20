import { Component, OnInit } from '@angular/core';

import { MediacheckService } from './mediacheck.service';
import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-home',
  template: `
    <div *ngIf="mqview.getIsLarge">Large</div>
    <div *ngIf="!mqview.getIsLarge">Small</div>
  `
})
export class HomeComponent implements OnInit {
  
  constructor(private mqview: MqviewService) { }

  ngOnInit() {
  }

}
