import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <p>Child component: {{getSize}}</p>
  `
})
export class ChildComponent implements OnChanges {
  // inherited 'isLarge' property from parent
  @Input() isLarge: boolean;
  // display size based on the inherited property value
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
