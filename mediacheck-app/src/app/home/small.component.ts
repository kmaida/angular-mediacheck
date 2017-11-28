import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small',
  template: `
    <ul class="list-group">
      <li *ngFor="let pet of pets" class="list-group-item">
        {{ pet.name }}
      </li>
    <ul>
  `,
  styles: []
})
export class SmallComponent implements OnInit {
  @Input() pets;

  constructor() { }

  ngOnInit() {
  }

}
