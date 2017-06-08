import { Component } from '@angular/core';

interface User {
  firstName: string,
  lastName: string,
  age: number,
  active: boolean,
  dateOfBirth: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  private user: User = {
    firstName: 'Williams',
    lastName: 'Medina',
    age: 28,
    active: true,
    dateOfBirth: new Date(1989, 0, 28)
  }
  constructor () {
    console.log('Current User', this.user)
  }
}
