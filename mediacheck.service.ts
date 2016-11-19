import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class MediacheckService {

  constructor(private zone: NgZone) { }

  mqueries = {
    small: '(max-width: 767px)',
    large: '(min-width: 768px)'
  };

  check(mqName: string): boolean {
    if (!this.mqueries[mqName]) {
      console.warn(`No media query registered for "${mqName}"!`);
    }
    return window.matchMedia(this.mqueries[mqName]).matches;
  }

  onMqChange(mqName: string, callback) {
    let self = this;

    if (typeof callback === 'function') {
      let mql: MediaQueryList = window.matchMedia(this.mqueries[mqName]);

      // if listener is already in list, this has no effect
      mql.addListener((mql: MediaQueryList) => {
        self.zone.run(() => {
          if (mql.matches) {
            callback(mql);
          }
        });
      });

    } else {
      console.warn(`No valid callback available for "${mqName}"!`);
    }
  }
}
