import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { GameService } from 'src/app/services/game.service';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent implements OnInit {

  @ViewChild('playersContainer') private playersContainerRef!: ElementRef;

  players: Player[] = [];

  onDestroy$ = new Subject<boolean>();

  newPlayerBtn: GenericButton = {
    name: 'Nuevo jugador',
    icon: this.utilsService.getIconUrl('add'),
    size: 'big',
    action: () => this.addNewPlayer()
  }

  readyBtn: MenuButton = {
    name: 'LISTO!',
    icon: this.utilsService.getIconUrl('dartboard', {color: 'red'}),
    action: () => this.startGame()
  }

  constructor(private gameService: GameService, private utilsService: UtilsService, private stateService: StateService) { }

  ngOnInit(): void {
    this.gameService.players$
    .pipe(
      takeUntil(this.onDestroy$)
    )
    .subscribe(players => {
      // Ordenar por createdIndex para mostrar en la UI de edición el orden de creación original
      this.players = this.utilsService.orderPlayers(players);
      // Resetear estado de los jugadores cuando volvemos a esta pantalla
      this.players.forEach(player => {
        if(!player.isAlive) {
          player.isAlive = true;
        }
        player.tag = undefined;
      });
      // console.log('Current players:', this.players);
    });

    if(!this.players.length) { // default players
      this.gameService.addNewPlayer();
      this.gameService.addNewPlayer();
    }
  }

  addNewPlayer() {
    this.gameService.addNewPlayer();

    // Espera a que Angular pinte el nuevo <app-player>
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() {
    const el = this.playersContainerRef.nativeElement;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth'
    });
  }

  startGame() {
    if(this.players.length < 2) return;
    // Resetear el estado del ganador antes de empezar
    this.gameService.winnerSubject.next(null);
    this.stateService.navigateTo('game');
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get isDisabled() {
    return this.players.length < 2;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
