import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interface/player';
import { GameService } from 'src/app/services/game.service';
import { StatesService } from 'src/app/services/states.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {

  players: Player[] = [];

  defaultPlayers = [ // todo mover a default-factory.service
    { name: 'Jugador 1', fighterGif: this.utilsService.getFighterGif(1) },
    { name: 'Jugador 2', fighterGif: this.utilsService.getFighterGif(1) }
  ];

  constructor(private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
    });

    this.gameService.addPlayer(...this.defaultPlayers);
  }

}
