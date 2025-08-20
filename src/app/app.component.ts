import { Component, OnInit } from '@angular/core';
import { StatesService } from './services/states.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'boxing-darts-angular';

  constructor(private statesService: StatesService) {
    this.statesService.init();
  }

  ngOnInit() {
    document.addEventListener('backbutton', () => {
      this.statesService.goBack();
    });
  }
}
