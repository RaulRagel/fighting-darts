import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { GameService } from 'src/app/services/game.service';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent implements OnInit {

  players: Player[] = [];

  newPlayerBtn: GenericButton = { // todo mover a button-factory.service
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
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
    });

    if(!this.players.length) { // default players
      this.gameService.addNewPlayer();
      this.gameService.addNewPlayer();
    }
  }

  addNewPlayer() {
    this.gameService.addNewPlayer();
  }

  startGame() {
    if(this.players.length < 2) return;
    this.stateService.navigateTo('game');
  }

  get isDisabled() {
    return this.players.length < 2;
  }

}
