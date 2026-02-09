import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { Player } from 'src/app/interfaces/player';
import { GameService } from 'src/app/services/game.service';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  playing: boolean = false;
  round: number = 0;

  title: string = 'Turno de Player1'; // Turno de Player1
  subtitle: string = 'Ronda 1'; // Ronda 1

  players: Player[] = [];
  winner: Player | null = null;

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

  headerExtraButtons: any[] = [
    {
      icon: this.utilsService.getIconUrl('edit'),
      action: () => this.gameService.togglePlayersHealthActions()
    }
  ];

  constructor(private stateService: StateService, private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(players => {
        this.players = players;
        if (!this.playing && this.players.length >= 2) {
          this.initGame();
        }
      });

    this.gameService.winner$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(winner => {
        this.winner = winner;
        if(winner) {
          this.updateButtonsForWinner();
        }
      });
    
    // if(!this.players.length) { // ! BORRAR, SOLO PARA DESAROLLAR ESTA PANTALLA SIN TENER QUE PASAR POR ADD PLAYERS
    //   this.gameService.addNewPlayer();
    //   this.gameService.addNewPlayer();
    // }

    if(this.players.length < 2) {
      this.stateService.goBack();
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

  updateButtonsForWinner() {
    this.buttons = [
      {
        name: 'Reiniciar',
        icon: this.utilsService.getIconUrl('refresh'),
        action: () => this.restartGame()
      }
    ];
  }

  restartGame() {
    // Resetear estado del juego pero manteniendo los jugadores actuales
    this.winner = null;
    this.gameService.winnerSubject.next(null);
    
    // Restaurar vida y estado de los jugadores
    const currentPlayers = this.gameService.currentPlayers;
    currentPlayers.forEach(player => {
      player.isAlive = true;
      player.hp$.next(this.utilsService.maxHealth);
      player.tag = undefined;
      player.currentTurn = false;
    });
    this.gameService.playersSubject.next([...currentPlayers]);
    
    // Restaurar botones normales
    this.buttons = [
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
    
    // Reiniciar el juego
    this.playing = false;
    this.initGame();
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
