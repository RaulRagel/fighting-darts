import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
      // size: 'big',
      action: () => {}
    },
    {
      name: 'Siguiente turno',
      icon: this.utilsService.getIconUrl('right'),
      // size: 'big',
      action: () => this.nextTurn()
    },
  ];

  constructor(private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
    .pipe(
      takeUntil(this.onDestroy$)
    )
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
      if(!this.playing) this.initGame();
    });

    if(!this.players.length) { // !! BORRAR, SOLO PARA DESAROLLAR ESTA PANTALLA SIN TENER QUE PASAR POR ADD PLAYERS
      this.gameService.addNewPlayer();
      this.gameService.addNewPlayer();
    }
  }

  initGame() {
    console.log('Game started');
    if(this.players.length >= 2) {
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
  }

  nextTurn() {
    this.gameService.nextTurn();
  }

  // Abrir pantalla de detalles para que el jugador pueda apuntar los lanzamientos en la diana
  openDartboard() {
    console.log('Open dartboard');
    this.showDartboard = true;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
