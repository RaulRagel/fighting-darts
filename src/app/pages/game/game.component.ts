import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
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

  playing: boolean = false;
  round: number = 0;

  title: string = 'Turno de Player 1'; // Turno de Player 1
  subtitle: string = 'Ronda 1'; // Ronda 1

  players: Player[] = [];

  showDartboard: boolean = false;

  onDestroy$ = new Subject<boolean>();

  buttons: GenericButton[] = [ // todo mover a button-factory.service
    {
      name: 'Lanzar dardos',
      icon: this.utilsService.getIconUrl('dart'),
      action: () => this.openDartboard()
    },
    {
      name: 'Siguiente turno',
      icon: this.utilsService.getIconUrl('right'),
      action: () => this.nextTurn()
    },
  ];

  constructor(private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(players => {
        this.players = players;
        if (!this.playing && this.players.length >= 2) {
          this.initGame();
        }
      });
    
    if(!this.players.length) { // !! BORRAR, SOLO PARA DESAROLLAR ESTA PANTALLA SIN TENER QUE PASAR POR ADD PLAYERS
      this.gameService.addNewPlayer();
      this.gameService.addNewPlayer();
    }
  }

  initGame() {
    console.log('call initGame, hay players');
    this.playing = true;
    this.gameService.startGame();

    this.gameService.turnOf$.subscribe(turnIndex => {
      const currentPlayer = this.players[turnIndex];
      this.title = `Turno de ${currentPlayer.name}`;
    });

    this.gameService.round$.subscribe(round => {
      this.round = round;
      this.subtitle = `Ronda ${this.round}`;
    });
  }

  nextTurn() {
    this.gameService.nextTurn();
  }

  // Abrir pantalla de detalles para que el jugador pueda apuntar los lanzamientos en la diana
  openDartboard() {
    // console.log('Open dartboard');
    this.showDartboard = true;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  // testAction() { // !! test
  //   let player = this.gameService.currentPlayers[0];
  //   this.gameService.hitPlayer(player, 5);
  // }

}
