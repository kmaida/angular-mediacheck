# Angular mediacheck

This is a service (with usage examples) that **adds media query event listeners to your Angular application**. It can be used to manipulate component properties, templates, and behavior when matching different media queries. It is a spiritual successor to Angular v1.x [angularjs-mediaCheck](https://github.com/kmaida/angularjs-mediaCheck), but has been revamped and greatly simplified for a better Angular (v2+) implementation.

## What's in the box?

This GitHub repo contains the [`mediacheck.service.ts`](https://github.com/kmaida/angular-mediacheck/blob/master/mediacheck.service.ts) file. It also provides samples of ways you can utilize the `MediacheckService` in your apps.

* [How it Works](#how-it-works)
* [Providing MediacheckService](#providing-mediacheckservice)
* [Usage Examples](#usage-examples)
* [Contributing](#contributing)
* [Changelog](#changelog)

## How it Works

Check out / download the service source code here: [`mediacheck.service.ts`](https://github.com/kmaida/angular-mediacheck/blob/master/mediacheck.service.ts).

### Methods

The following methods are provided by `MediacheckService`:

#### setQueries(customMqs)

Out of the box, the service currently provides two simple media queries. They are defined in the service like so:

```
mqueries = {
  small: '(max-width: 767px)',
  large: '(min-width: 768px)'
};
```

You may, of course, provide your own different breakpoints in your app that the service will then use. You can do so by passing them to the `setQueries(customMqsObj)` method like so:

```
  customMqs = {
    mobile: '(max-width: 480px)',
    tablet: '(min-width: 481px) and (max-width: 768px)',
    desktop: '(min-width: 769px)'
  };

  constructor(private mediacheck: MediacheckService) {
    this.mediacheck.setQueries(this.customMqs);
  }
```

#### initSubject()

This method initializes a [subject](https://medium.com/@benlesh/on-the-subject-of-subjects-in-rxjs-2b08b7198b93): `mq$`. This subject provides a _stream_ that emits a value whenever the browser's media query changes. If you wish to use subscriptions to execute functionality when the breakpoint changes, then run the `initSubject()` method in your component's constructor and then subscribe to the `mq$` subject that is subsequently created.

This can be done like so:

```
  constructor(private mediacheck: MediacheckService) {
    this.mediacheck.initSubject();
  }

  ngOnInit() {
    this.mediacheck.mq$.subscribe((mq) => {
      console.log('current mq:', mq);
    });
  }
```

> **Note:** If you want to use your own custom media queries, you must pass them to the `setQueries(customMqsObj)` method _before_ calling `initSubject()`. If you do not, the subject will initialize using the default media queries defined in MediacheckService.

#### check(mqName) 

`check(mqName)` expects a `string` parameter with the name of the media query you'd like to match, e.g., `small`, `large`, etc. 

* This is a shortcut for `window.matchMedia('mediaquerystring').matches`.
* It will return `true` if the media query currently matches and `false` if it doesn't.
* It will output a warning if it can't find a media query registered with the `mqName` provided.

#### get getMqName()

`getMqName` is a getter that returns the string key for the currently active media query, e.g., `small`, `large`, etc.

#### onMqChange(mqName, callback)

`onMqChange(mqName, callback)` expects a `string` parameter with the name of the media query you'd like to match, e.g., `small`, `large`, etc. It also expects a callback `function`. This function will execute when the media query activates.

* This method [adds a MediaQueryList listener](https://msdn.microsoft.com/library/hh772467.aspx) with the `callback` parameter.
* On media query change, it executes the callback function and passes the [`MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) parameter so your components can utilize it.
* It implements [zones](http://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html) for Angular change detection.

## Providing MediacheckService

`MediacheckService` can be used as a _singleton_ or as _multiple instances_. Be mindful of your usage.

### App Module (singleton)

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

In components that should use the global instance of `MediacheckService`, be sure to import the service and add it to the component's constructor.

### Component Providers (instances)

In the component where you would like to create a MediacheckService instance, import `MediacheckService` and add it to the `@Component`'s `providers` array. Make sure to pass it to the constructor as well.

```
...
import { MedicheckService } from './mediacheck.service';

@Component({
  ...,
  providers: [MediacheckService]
})
export class InstanceComponent {
  constructor(private mediacheck: MediacheckService) {}
  ...
```

## Usage Examples

To explore different ways to use Mediacheck effectively, you can clone this repo and run the [sample app here](https://github.com/kmaida/angular-mediacheck/tree/master/mediacheck-app). You must have the [@angular/cli](https://github.com/angular/angular-cli) installed. Run `npm install` to download dependencies. Then run `ng serve` to serve the app and view it at `http://localhost:4200` in your browser.

## Contributing

Please feel free to fork and contribute to this repository by submitting pull requests. Additional use-case samples are welcome. Please make sure that any sample code has been thoroughly tested in a real project before submitting for inclusion.

Thank you!

## Changelog

* 11/28/2017 - major update of service to incorporate a subject. Updated README, removed old examples, replaced with full sample app
* 03/24/2017 - rename repo to `angular-mediacheck` to match Angular branding guidelines and honor release of Angular 4
* 03/23/2017 - simplified code in helper service and in components
* 03/01/2017 - cleaned up code to comply with angular-cli rc linting rules
* 11/21/2016 - added a getter in `MediacheckService` that returns the key of the active media query
* 11/20/2016 - expanded setter/getter sample to support subscription
* 11/20/2016 - added example for a setter/getter service and supporting documentation

[MIT License](https://github.com/kmaida/angular-mediacheck/blob/master/LICENSE)
