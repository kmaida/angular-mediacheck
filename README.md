# Angular 2 mediacheck

This is a service (with usage examples) that **adds media query event listeners to your Angular 2 application**. It can be used to manipulate component properties, templates, and behavior when matching different media queries. It is a spiritual successor to Angular v1.x [angular-mediaCheck](https://github.com/kmaida/angular-mediaCheck), but has been revamped and greatly simplified for a better Angular 2 implementation.

## What's in the box?

This GitHub repo contains the [`mediacheck.service.ts`](https://github.com/kmaida/angular2-mediacheck/blob/master/mediacheck.service.ts) file. It also provides samples of ways you can utilize the `MediacheckService` in your apps.

* [How it Works](https://github.com/kmaida/angular2-mediacheck#how-it-works)
* [Providing MediacheckService](https://github.com/kmaida/angular2-mediacheck#providing-mediacheckservice)
* [Usage Example: Data Service](https://github.com/kmaida/angular2-mediacheck#usage-example-data-service)
* [Usage Example: Input / OnChanges](https://github.com/kmaida/angular2-mediacheck#usage-example-input--onchanges)
* [Contributing](https://github.com/kmaida/angular2-mediacheck#contributing)
* [Changelog](https://github.com/kmaida/angular2-mediacheck#changelog)

## How it Works

Check out the service source code: [`mediacheck.service.ts`](https://github.com/kmaida/angular2-mediacheck/blob/master/mediacheck.service.ts).

### Media Query Definitions

Out of the box, the service currently provides two simple media queries. They are defined in the service like so:

```
mqueries = {
  small: '(max-width: 767px)',
  large: '(min-width: 768px)'
};
```

You may, of course, provide additional media queries. Simply add them to the `mqueries` object and reference them by key as needed.

### Methods

The following methods are provided by `MediacheckService`:

#### check(mqName) 

`check(mqName)` expects a `string` parameter with the name of the media query you'd like to match, ie., `small`, `large`, etc. 

* This is a shortcut for `window.matchMedia('mediaquerystring').matches`. 
* It will return `true` if the media query currently matches and `false` if it doesn't. 
* It will also output a warning if it can't find a media query registered with the `mqName` provided.

#### onMqChange(mqName, callback)

`onMqChange(mqName, callback)` expects a `string` parameter with the name of the media query you'd like to match, ie., `small`, `large`, etc. 

It also expects a callback `function`. This function will execute when the media query activates.

* This method [adds a MediaQueryList listener](https://msdn.microsoft.com/library/hh772467.aspx) with the `callback` parameter.
* On media query change, it executes the callback function and passes the [`MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) parameter so your components can utilize it.
* It implements [zones](http://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html) for Angular 2 change detection.

#### get getMqName()

`getMqName` is a getter that returns the string key for the currently active media query, ie., `small`, `large`, etc.

## Providing the MediacheckService

The normal use of `MediacheckService` is as a _singleton_ (unless multiple instances are specifically desired; note that care should be taken with a multiple instance approach).

### App Module

In the file containing the `@NgModule` where you wish to inject the service (for many projects, this will be `app.module.ts`), import the `MediacheckService` class and add it to the `@NgModule`'s `providers` array:

```
...
import { MedicheckService } from './mediacheck.service';

@NgModule({
  ...,
  providers: [MediacheckService],
  ...
})
export class AppModule { }
```

## Usage Example: Data Service

This is likely the simplest and most ubiquitious implementation example. This approach is especially effective if you have routed components and need to implement template and/or script changes based on media queries _throughout_ your app.

You should create an intermediary service to set screen size data in the root component. You can then share it globally throughout the app without the need to directly pass inputs to children. Any component can access the service to get or subscribe to its data.

The following `MqviewService` example supports setting, getting, and subscribing to data. We'll use the root app component to set this data by using the `MediacheckService`.

### Mqview Service

Keep in mind that the data store service is entirely reliant on data flowing to it from elsewhere. This sample could be used with any data you wanted to set, get, and subscribe to in your app. 

When used with the default **angular2-mediacheck**, the data store service might look something like this:

```
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MqviewService {
  isLarge: boolean;
  private isLargeSource = new BehaviorSubject<boolean>(this.isLarge);

  // isLarge subject - can be observed
  isLarge$ = this.isLargeSource;

  // set isLarge$ / isLarge values
  setIsLarge(value: boolean) {
    this.isLargeSource.next(value);
    this.isLarge = value;
  }

  // getter to retrieve current value of isLarge
  get getIsLarge(): boolean {
    return this.isLarge;
  }

}
```

You can download this code here: [mqview.service.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-mqview-service/mqview.service.ts).

### Root App Component

Your root app component then sets the data in `MqviewService` based on its use of `MediacheckService`. The code might look something like this:

```
import { Component, OnInit } from '@angular/core';
import { MediacheckService } from './mediacheck.service';
import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-root',
  template: `
    <p><strong>Media Query Shortname:</strong> {{mc.getMqName}}</p>
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
```

You can download this code here: [app.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-mqview-service/app.component.ts).

### Component

Finally, components in your app can use the getter `mqview.getIsLarge` directly to make changes in their templates. You can also _subscribe_ to the `mqview.isLarge$` subject to execute code when the media query changes. App components might look something like this:

```
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
  
  constructor(public mqview: MqviewService) { }

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
```

You can download this code here: [home.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-mqview-service/home.component.ts).

## Usage Example: Input / OnChanges

If you _don't_ want to use the service above and need [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) with the same set of media queries through child components, I recommend injecting the service _only_ in the most ancestral component(s)* and using `Input` and/or `OnChanges` in children.

### Parent Component

*_NOTE: If you want to share data across different_ routed _components, this approach is not logical. You'll want to explore [Usage Example: Data Service](https://github.com/kmaida/angular2-mediacheck#usage-example-data-service)._

Your parent component might look something like this:

```
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
    this.mc.onMqChange('small', (mql: MediaQueryList) => {
      this.showSmall(mql);
    });

    // set up listener for entering 'large' media query
    this.mc.onMqChange('large', (mql: MediaQueryList) => {
      this.showLarge(mql);
    });
  }

  showSmall(mql: MediaQueryList) {
    console.log(`Entering SMALL mq: ${mql.media}`);
    this.isLarge = false;
  }

  showLarge(mql: MediaQueryList) {
    console.log(`Entering LARGE mq: ${mql.media}`);
    this.isLarge = true;
  }

}
```

You can download this code here: [app.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-parent-to-child/app.component.ts).

### Child Components

Your parent component should be ubiquitious enough for child components to use it without having to inject `MediacheckService` and create their own matchMedia listeners. Here is an example showing two ways to use the base component's properties to react to media query events:

```
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <p>Child component: {{getSize}}</p>
  `
})
export class ChildComponent implements OnChanges {
  // input 'isLarge' property from parent
  @Input() isLarge: boolean;
  // display size based on the input property value
  size: string;

  // detect and respond to changes to input(s)
  ngOnChanges(changes) {
    let isLargeCurrent = changes.isLarge.currentValue;
    console.log(`isLarge input change detected: ${isLargeCurrent}`);
  }

  // accessor to return property
  get getSize(): string {
    this.size = this.isLarge ? 'Big' : 'Little';
    return this.size;
  }
}
```

You can download this code here: [child.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-parent-to-child/child.component.ts).

## Contributing

Please feel free to fork and contribute to this repository by submitting pull requests. Additional use-case samples are welcome. Please make sure that any sample code has been thoroughly tested in a real project before submitting for inclusion.

Thank you!

## Changelog
* 03/01/2017 - cleaned up code to comply with angular-cli rc.0 linting rules
* 11/21/2016 - added a getter in `MediacheckService` that returns the key of the active media query
* 11/20/2016 - expanded setter/getter sample to support subscription
* 11/20/2016 - added example for a setter/getter service and supporting documentation

[MIT License](https://github.com/kmaida/angular2-mediacheck/blob/master/LICENSE)



