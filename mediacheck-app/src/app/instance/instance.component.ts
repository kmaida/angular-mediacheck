import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediacheckService } from '../mediacheck.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css'],
  providers: [MediacheckService]
})
export class InstanceComponent implements OnInit, OnDestroy {
  customMqs = {
    mobile: '(max-width: 480px)',
    tablet: '(min-width: 481px) and (max-width: 768px)',
    desktop: '(min-width: 769px)'
  };
  mqSub: Subscription;
  mqName: string;
  media: string;

  constructor(private mc: MediacheckService) {
    this.mc.setQueries(this.customMqs);
    this.mc.initSubject();
  }

  ngOnInit() {
    this.mqSub = this.mc.mq$.subscribe((mq) => {
      this.mqName = mq;
      this.media = this.mc.mqueries[mq];
    });
  }

  ngOnDestroy() {
    this.mqSub.unsubscribe();
  }

}
