import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  title: string = 'Turno de Player 1'; // Turno de Player 1
  subtitle: string = 'Ronda 1'; // Ronda 1

  players: Player[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.players$
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
    });
  }

}
