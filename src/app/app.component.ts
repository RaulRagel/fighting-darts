import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fighting-darts';

  constructor(private stateService: StateService) {
    this.stateService.init();
  }

  ngOnInit() {
    document.addEventListener('backbutton', () => {
      this.stateService.goBack();
    });
  }
}
