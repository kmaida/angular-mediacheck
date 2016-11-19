import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class MediacheckService {

  constructor(private zone: NgZone) { }

  mqueries = {
    small: '(max-width: 767px)',
    large: '(min-width: 768px)'
  };

  check(size: string) {
    if (!this.mqueries[size]) {
      console.warn(`No media query registered for size "${size}"!`);
    }
    return window.matchMedia(this.mqueries[size]).matches;
  }

  onMqChange(size: string, callback) {
    let self = this;

    if (typeof callback === 'function') {
      let mql: MediaQueryList = window.matchMedia(this.mqueries[size]);

      // if listener is already in list, this has no effect
      mql.addListener((mql: MediaQueryList) => {
        self.zone.run(() => {
          if (mql.matches) {
            callback(mql);
          }
        });
      });

    } else {
      console.warn(`No valid callback available for "${size}"!`);
    }
  }
}
