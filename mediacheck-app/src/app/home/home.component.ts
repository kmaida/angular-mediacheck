import { Component, OnInit } from '@angular/core';
import { MediacheckService } from './../mediacheck.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLarge: boolean;
  mqName: string;
  media: string;
  pets = [
    {
      name: '"Basil"',
      breed: 'Domestic Shorthair Cat',
      color: 'Tuxedo'
    },
    {
      name: '"Peppermint Butler"',
      breed: 'Domestic Shorthair Cat',
      color: 'Tabby'
    },
    {
      name: '"Sable"',
      breed: 'Domestic Shorthair Cat',
      color: 'Calico'
    },
    {
      name: '"Fawkes"',
      breed: 'German Shepherd Dog',
      color: 'Silver Sable'
    }
  ];

  constructor(private mc: MediacheckService) {
    this.mqName = this.mc.getMqName;
    this.media = this.mc.mqueries[this.mqName];
  }

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

  showSmall(mql: MediaQueryList) {
    console.log(`Entering SMALL mq: ${mql.media}`);
    this.isLarge = false;
    this.mqName = 'small';
    this.media = mql.media;
  }

  showLarge(mql: MediaQueryList) {
    console.log(`Entering LARGE mq: ${mql.media}`);
    this.isLarge = true;
    this.mqName = 'large';
    this.media = mql.media;
  }

}
