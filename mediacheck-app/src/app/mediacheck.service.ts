import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MediacheckService {
  mqueries: { [key: string]: string; } = {
    small: '(max-width: 767px)',
    large: '(min-width: 768px)'
  };
  mq: string;
  mq$;

  constructor(private zone: NgZone) {}

  // If you'd like to customize the object containing
  // media queries, pass your new object to this method.
  setQueries(newQueries: { [key: string]: string; }) {
    this.mqueries = Object.assign({}, newQueries);
  }

  // Set mq$ / mq values
  private _setMq(value: string) {
    this.mq$.next(value);
    this.mq = value;
  }

  // Call this method to automatically initialize mq$ subject.
  // This will allow components to subscribe to mq$ to get the
  // current breakpoint whenever it changes. This needs to be
  // run AFTER setQueries(), if custom breakpoints are used.
  initSubject() {
    const nKeys = Object.keys(this.mqueries).length;
    this.mq = this.getMqName;
    this.mq$ = new BehaviorSubject<string>(this.mq);
    switch (true) {
      case nKeys > 2:
        for (const key in this.mqueries) {
          if (this.mqueries.hasOwnProperty(key)) {
            const mqlist = window.matchMedia(this.mqueries[key]);
            mqlist.addListener((mqlParam) => {
              if (window.matchMedia(this.mqueries[key]).matches) {
                this.zone.run(() => {
                  this._setMq(key);
                });
              }
            });
          }
        }
        break;
      case nKeys === 2:
        const firstQueryName = Object.keys(this.mqueries)[0];
        const secondQueryName = Object.keys(this.mqueries)[1];
        const mql = window.matchMedia(this.mqueries[firstQueryName]);
        mql.addListener((mqlParam) => {
          const currentQuery = window.matchMedia(this.mqueries[firstQueryName]).matches ? firstQueryName : secondQueryName;
          this.zone.run(() => {
            this._setMq(currentQuery);
          });
        });
        break;
      default:
        console.warn(`You must define 2 or more breakpoints. You have only set ${nKeys}.`);
    }
  }

  // Runs matchMedia to check if active breakpoint
  // is the same as the one passed into the method.
  check(mqName: string): boolean {
    if (!this.mqueries[mqName]) {
      console.warn(`No media query registered for "${mqName}"!`);
    }
    return window.matchMedia(this.mqueries[mqName]).matches;
  }

  // Get the name of the currently active breakpoint.
  get getMqName(): string {
    for (const key in this.mqueries) {
      if (window.matchMedia(this.mqueries[key]).matches) {
        return key;
      }
    }
  }

  // Use this method to manually set up listeners
  // with callbacks for specific breakpoints.
  onMqChange(mqName: string, callback) {
    if (typeof callback === 'function') {
      const mql = window.matchMedia(this.mqueries[mqName]);
      // if listener is already in list, this has no effect
      mql.addListener((mqlParam) => {
        this.zone.run(() => {
          if (mqlParam.matches) {
            callback(mqlParam);
          }
        });
      });
    } else {
      console.warn(`No valid callback function has been provided for "${mqName}"!`);
    }
  }
}
