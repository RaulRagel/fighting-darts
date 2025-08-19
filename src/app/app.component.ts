import { Component } from '@angular/core';
import { StatesService } from './services/states.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'boxing-darts-angular';

  constructor(private statesService: StatesService) {
    this.statesService.init();
  }
}
