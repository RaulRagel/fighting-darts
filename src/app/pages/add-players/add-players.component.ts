import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { GenericButton } from 'src/app/interfaces/generic-button';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { GameService } from 'src/app/services/game.service';
import { StatesService } from 'src/app/services/states.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent implements OnInit {

  players: Player[] = [];

  defaultPlayers = [ // todo mover a default-factory.service
    {
      name: 'Jugador 1',
      // fighterGif: this.utilsService.getFighterGif(1)
    },
    {
      name: 'Jugador 2',
      // fighterGif: this.utilsService.getFighterGif(1)
    }
  ];

  newPlayerBtn: GenericButton = { // todo mover a button-factory.service
    name: 'Nuevo jugador',
    icon: this.utilsService.getIconUrl('add'),
    size: 'big',
    action: () => this.addNewPlayerTemplate()
  }

  readyBtn: MenuButton = {
    name: 'LISTO!',
    icon: this.utilsService.getIconUrl('dartboard', {color: 'red'})
  }

  constructor(private gameService: GameService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.gameService.players$
    .subscribe(players => {
      this.players = players;
      console.log('Current players:', this.players);
    });

    if(!this.players.length) {
      this.gameService.addPlayer(...this.defaultPlayers);
    }
  }

  addNewPlayerTemplate() {

  }

}
