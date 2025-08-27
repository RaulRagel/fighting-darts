import { Component, OnInit } from '@angular/core';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { Player } from 'src/app/interfaces/player';
import { GameService } from 'src/app/services/game.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  title: string = 'Turno de Player 1'; // Turno de Player 1
  subtitle: string = 'Ronda 1'; // Ronda 1

  players: Player[] = [];

  buttons: GenericButton[] = [ // todo mover a button-factory.service
    {
      name: 'Lanzar dardos',
      icon: this.utilsService.getIconUrl('dart'),
      // size: 'big',
      action: () => {}
    },
    {
      name: 'Siguiente turno',
      icon: this.utilsService.getIconUrl('right'),
      // size: 'big',
      action: () => {}
    },
  ];

  constructor(private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
      this.initGame();
    });

    if(!this.players.length) { // !! BORRAR, SOLO PARA DESAROLLAR ESTA PANTALLA SIN TENER QUE PASAR POR ADD PLAYERS
      this.gameService.addNewPlayer();
      this.gameService.addNewPlayer();
    }
  }

  initGame() {
    console.log('Game started');
    // this.setTurn(0);
  }

}
