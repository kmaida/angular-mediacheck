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
