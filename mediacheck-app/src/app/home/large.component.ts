import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-large',
  template: `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Breed</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let pet of pets">
          <td>{{ pet.name }}</td>
          <td>{{ pet.breed }}</td>
          <td>{{ pet.color }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class LargeComponent implements OnInit {
  @Input() pets;

  constructor() { }

  ngOnInit() {
  }

}
