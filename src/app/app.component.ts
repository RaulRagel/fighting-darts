import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fighting-darts';

  constructor(private stateService: StateService, private configService: ConfigService) {
    this.stateService.init();
  }

  ngOnInit() {
    // Cargar configuración guardada al inicializar la app
    this.configService.loadFromStorage();

    document.addEventListener('backbutton', () => {
      this.stateService.goBack();
    });
  }
}
