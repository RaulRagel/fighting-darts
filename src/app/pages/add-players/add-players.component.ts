import { Component, OnInit } from '@angular/core';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {

  constructor(private statesService: StatesService) { }

  ngOnInit(): void {
  }

}
