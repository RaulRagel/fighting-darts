import { Component, OnInit } from '@angular/core';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {

  constructor(private stateService: StatesService) { }

  ngOnInit(): void {
  }

  goBack() {
    this.stateService.goBack();
  }
}
