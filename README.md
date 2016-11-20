# Angular 2 mediacheck

This is a service (with usage examples) that **adds media query event listeners to your Angular 2 application**. It can be used to manipulate component properties, templates, and behavior when matching different media queries. It is a spiritual successor to Angular v1.x [angular-mediaCheck](https://github.com/kmaida/angular-mediaCheck), but has been revamped and greatly simplified for a better Angular 2 implementation.

## What's in the box?

This GitHub repo contains the [`mediacheck.service.ts`](https://github.com/kmaida/angular2-mediacheck/blob/master/mediacheck.service.ts) file. It also provides samples of ways you can utilize the `MediacheckService` in your apps.

* [How it Works](https://github.com/kmaida/angular2-mediacheck#how-it-works)
* [Providing MediacheckService](https://github.com/kmaida/angular2-mediacheck#providing-mediacheckservice)
* [Usage Example: Setter / Getter Service](https://github.com/kmaida/angular2-mediacheck#usage-example-setter--getter-service)
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

## Providing MediacheckService

The normal use of `MediacheckService` is as a _singleton_ (unless multiple instances are specifically desired; note that care should be taken with a multiple instance approach).

### App Module

In the file containing the `@NgModule` where you wish to inject the service (for many projects, this will be `app.module.ts`), import the `MediacheckService` class and add it to the `@NgModule`'s `providers` array:

```
// app.module.ts

...
import { MedicheckService } from './mediacheck.service';

@NgModule({
  ...,
  providers: [MediacheckService],
  bootstrap: [...]
})
export class AppModule { }
```

## Usage Example: Setter / Getter Service

This is likely the simplest use-case. This approach is most effective if you have routed components and need to implement template changes based on media queries throughout your app.

You may wish to create an intermediary service to set and get screen size data in the root component and then share it globally throughout the app without the need to directly pass inputs to children. Keep in mind that a simple setter/getter service does not provide a method of observation in script, so if you need to make imperative changes, you'll have to use a hybrid approach or implement something new (feel free to submit pull requests with other useful samples!).

### Mqview Service

Your setter/getter service might look something like this:

```
import { Injectable } from '@angular/core';

@Injectable()
export class MqviewService {
  isLarge: boolean;

  setIsLarge(value: boolean) {
    this.isLarge = value;
  }

  get getIsLarge(): boolean {
    return this.isLarge;
  }

}
```

You can download this code here: [mqview.service.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-mqview-service/mqview.service.ts).

### Root App Component

Your root app component might look something like this:

```
import { Component, OnInit } from '@angular/core';

import { MediacheckService } from './mediacheck.service';
import { MqviewService } from './mqview.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
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

Your [routed] components might look like this:

```
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
```

You can download this code here: [home.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-mqview-service/home.component.ts).

## Usage Example: Input / OnChanges

If you need [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) with the _same_ set of media queries through child components and want to react to events in both the template and the TypeScript, I recommend injecting the service _only_ in the most ancestral component(s)* possible and using `Input` and/or `OnChanges` in children.

### Parent Component

*_NOTE: If you want to share data across_ routed _components, this approach may not be logical. You'll want to explore [Usage Example: Setter / Getter Service](https://github.com/kmaida/angular2-mediacheck#usage-example-setter--getter-service)._

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

Your root app component should be ubiquitious enough for child components to use it without having to inject `MediacheckService` and create their own matchMedia listeners. Here is an example showing two ways to use the base component's properties to react to media query events:

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

  // getter to return property
  get getSize() {
    this.size = this.isLarge ? 'Big' : 'Little';
    return this.size;
  }
}
```

You can download this code here: [child.component.ts](https://github.com/kmaida/angular2-mediacheck/blob/master/sample-parent-to-child/child.component.ts).

## Contributing

Please feel free to fork and contribute to this repository by submitting pull requests. Additional use-case samples are greatly encouraged. Please make sure that any sample code has been thoroughly checked in a project before submitting for inclusion.

Thank you!

## Changelog

* 11/20/16 - added example for a setter/getter service and supporting documentation.

---

[MIT License](https://github.com/kmaida/angular2-mediacheck/blob/master/LICENSE)



